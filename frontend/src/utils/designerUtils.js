import { findFittingFontSize } from "./textRenderer";
import { textWorker } from "./textWorkerClient";

export const addDesignCollageToActiveView = (
  collage,
  imgRef,
  setSelectedDesignId,
  updateDesignsByView,
  activePreview,
) => {
  if (!imgRef.current) return;

  const timestamp = Date.now();

  const generatedDesigns = collage.designs.map((d, idx) => ({
    ...d,
    id: `${crypto.randomUUID()}-${timestamp}-${idx}`,
  }));

  const lastDesignId = generatedDesigns[generatedDesigns.length - 1].id;

  updateDesignsByView((prev) => {
    const designs = prev[activePreview] || [];
    const highest = designs.length
      ? Math.max(...designs.map((d) => d.layer || 1))
      : 0;
    return {
      ...prev,
      [activePreview]: [
        ...prev[activePreview],
        ...generatedDesigns.map((d, idx) => ({
          ...d,
          x: d.x,
          y: d.y,
          width: d.width, // already normalized in data
          height: d.height, // already normalized in data
          aspect_ratio: d.width / d.height,
          originalAspectRatio: d.width / d.height,
          isLocked_aspect_ratio: true,
          type: d.type,
          text: d.text,
          is_colorable: d.is_colorable,
          design_color: d.design_color,
          outline_width: d.design_outline,
          outline_color: d.outline_color,
          fontFamily: d.fontFamily,
          isBold: d.isBold || false,
          isItalic: d.isItalic || false,
          text_alignment: d.text_alignment,
          text_shape: d.text_shape,
          shape_intensity: d.shape_intensity,
          lineSpacing: d.lineSpacing,

          horizontalFlip: d.horizontalFlip ? d.horizontalFlip : false,
          verticalFlip: d.verticalFlip ? d.verticalFlip : false,
          rotation: d.rotation ? d.rotation : 0,
          layer: highest + idx + 1,
          crop: d.crop ? d.crop : { x: 0, y: 0, width: 1, height: 1 },
        })),
      ],
    };
  });
  setSelectedDesignId(lastDesignId);
};

export function bringToFront(
  activePreview,
  selectedDesignId,
  setDesignsByView,
) {
  setDesignsByView((prev) => {
    const designs = [...(prev[activePreview] || [])];
    // sort designs by zIndex ascending
    designs.sort((a, b) => (a.layer || 0) - (b.layer || 0));

    const idx = designs.findIndex((d) => d.id === selectedDesignId);
    if (idx === designs.length - 1) return prev; // already highest

    // swap zIndex with the next higher design
    const current = designs[idx];
    const above = designs[idx + 1];
    const temp = current.layer;
    current.layer = above.layer;
    above.layer = temp;

    return { ...prev, [activePreview]: [...designs] };
  });
}

export function sendToBack(activePreview, selectedDesignId, setDesignsByView) {
  setDesignsByView((prev) => {
    const designs = [...(prev[activePreview] || [])];
    // sort designs by zIndex ascending
    designs.sort((a, b) => (a.layer || 0) - (b.layer || 0));

    const idx = designs.findIndex((d) => d.id === selectedDesignId);
    if (idx === 0) return prev; // already lowest

    // swap zIndex with the next lower design
    const current = designs[idx];
    const below = designs[idx - 1];
    const temp = current.layer;
    current.layer = below.layer;
    below.layer = temp;

    return { ...prev, [activePreview]: [...designs] };
  });
}

export const flipHorizontal = (
  activePreview,
  selectedDesignId,
  setDesignsByView,
) => {
  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === selectedDesignId
        ? { ...item, horizontalFlip: !item.horizontalFlip }
        : item,
    ),
  }));
};

export const flipVertical = (
  activePreview,
  selectedDesignId,
  setDesignsByView,
) => {
  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === selectedDesignId
        ? { ...item, verticalFlip: !item.verticalFlip }
        : item,
    ),
  }));
};

export const rotate = (
  d,
  setDesignsByView,
  activePreview,
  angleRad,
  regionWidth,
  regionHeight,
  getBoundingBox,
  adjust = false,
) => {
  if (isNaN(angleRad)) {
    return;
  }

  let newWidthNorm = d.width;
  let newHeightNorm = d.height;
  let newLock = d.isLocked_aspect_ratio;
  let d_x = d.x;
  let d_y = d.y;

  if (angleRad !== 0 && !d.isLocked_aspect_ratio) {
    newLock = !newLock;

    // If re-locking, restore original aspect ratio safely
    if (newLock) {
      const aspect = d.aspect_ratio;
      let newWidthPx = d.width * Math.min(regionWidth, regionHeight);
      let newHeightPx = newWidthPx / aspect;

      if (newWidthPx / regionWidth < 0.05) {
        newWidthPx = 0.05 * Math.min(regionWidth, regionHeight);
        newHeightPx = newWidthPx / aspect;
      }

      if (newHeightPx / regionHeight < 0.05) {
        newHeightPx = 0.05 * Math.min(regionWidth, regionHeight);
        newWidthPx = newHeightPx * aspect;
      }

      // clamp both dimensions simultaneously
      if (newWidthPx > regionWidth || newHeightPx > regionHeight) {
        const widthRatio = regionWidth / newWidthPx;
        const heightRatio = regionHeight / newHeightPx;
        const scale = Math.min(widthRatio, heightRatio);
        newWidthPx *= scale;
        newHeightPx *= scale;
      }

      // clamp position so edges stay inside
      let posX = d.x * regionWidth;
      let posY = d.y * regionHeight;

      if (posX + newWidthPx > regionWidth) posX = regionWidth - newWidthPx;
      if (posX < 0) posX = 0;
      if (posY + newHeightPx > regionHeight) posY = regionHeight - newHeightPx;
      if (posY < 0) posY = 0;

      newWidthNorm = newWidthPx / regionWidth;
      newHeightNorm = newHeightPx / regionHeight;
      d_x = posX / regionWidth;
      d_y = posY / regionHeight;
    }
  }

  let adjusted = { x: d_x, y: d_y, width: newWidthNorm, height: newHeightNorm };

  if (adjust) {
    adjusted = getRotationAdjustedValues(
      getBoundingBox,
      d,
      regionWidth,
      regionHeight,
      angleRad,
    );
  }

  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === d.id
        ? {
            ...item,
            rotation: angleRad,
            width: Math.round(adjusted.width * 1000) / 1000,
            height: Math.round(adjusted.height * 1000) / 1000,
            x: adjusted.x,
            y: adjusted.y,
            isLocked_aspect_ratio: newLock,
          }
        : item,
    ),
  }));
};

export function radToDeg(angleRad) {
  let degrees = angleRad * (180 / Math.PI);
  while (degrees > 180) degrees -= 360;
  while (degrees < -180) degrees += 360;
  return degrees;
}

export function getRotationAdjustedValues(
  getBoundingBox,
  selectedDesign,
  regionWidth,
  regionHeight,
  angle,
) {
  let bbox = getBoundingBox(
    selectedDesign.width * Math.min(regionWidth, regionHeight),
    (selectedDesign.width / selectedDesign.aspect_ratio) *
      Math.min(regionWidth, regionHeight),
    angle,
  );

  let posX = selectedDesign.x * regionWidth;

  let posY = selectedDesign.y * regionHeight;

  if (posX < 0) posX = 0;
  if (posY < 0) posY = 0;

  if (posX + bbox.width > regionWidth) {
    posX = Math.max(regionWidth - bbox.width, 0);
  }

  if (posY + bbox.height > regionHeight) {
    posY = Math.max(regionHeight - bbox.height, 0);
  }

  if (bbox.width > regionWidth || bbox.height > regionHeight) {
    const widthRatio = regionWidth / bbox.width;

    const heightRatio = regionHeight / bbox.height;

    const scale = Math.min(widthRatio, heightRatio);

    const newWidth = selectedDesign.width * regionWidth * scale;

    const newHeight =
      (selectedDesign.width / selectedDesign.aspect_ratio) *
      regionHeight *
      scale;

    bbox = getBoundingBox(newWidth, newHeight, angle);

    if (posX + bbox.width > regionWidth) {
      posX = Math.max(regionWidth - bbox.width, 0);
    }

    if (posY + bbox.height > regionHeight) {
      posY = Math.max(regionHeight - bbox.height, 0);
    }

    return {
      x: posX / regionWidth,
      y: posY / regionHeight,
      width: Math.round((newWidth / regionWidth) * 1000) / 1000,
      height: Math.round((newHeight / regionHeight) * 1000) / 1000,
    };
  }

  return {
    x: posX / regionWidth,
    y: posY / regionHeight,
    width: selectedDesign.width,
    height: selectedDesign.height,
  };
}

export function getNewSizePos(
  getBoundingBox,
  selectedDesign,
  activePreview,
  regionWidth,
  regionHeight,
  angle,
) {
  let bbox = getBoundingBox(
    selectedDesign?.width * Math.min(regionWidth, regionHeight),
    (selectedDesign?.width / selectedDesign?.aspect_ratio) *
      Math.min(regionWidth, regionHeight),
    angle,
  );
  let posX = selectedDesign?.x * regionWidth;
  let posY = selectedDesign?.y * regionHeight;

  if (posX < 0) posX = 0;
  if (posY < 0) posY = 0;
  if (posX + bbox.width > regionWidth)
    posX = Math.max(regionWidth - bbox.width, 0);
  if (posY + bbox.height > regionHeight)
    posY = Math.max(regionHeight - bbox.height, 0);

  if (bbox.width > regionWidth || bbox.height > regionHeight) {
    const widthRatio = regionWidth / bbox.width;
    const heightRatio = regionHeight / bbox.height;
    const scale = Math.min(widthRatio, heightRatio);

    const newWidth = selectedDesign?.width * regionWidth * scale;
    const newHeight =
      (selectedDesign?.width / selectedDesign?.aspect_ratio) *
      regionHeight *
      scale;

    bbox = getBoundingBox(newWidth, newHeight, angle);

    if (posX < 0) posX = 0;
    if (posY < 0) posY = 0;
    if (posX + bbox.width > regionWidth)
      posX = Math.max(regionWidth - bbox.width, 0);
    if (posY + bbox.height > regionHeight)
      posY = Math.max(regionHeight - bbox.height, 0);

    selectedDesign.x = posX / regionWidth;
    selectedDesign.y = posX / regionWidth;
    selectedDesign.width = Math.round((newWidth / regionWidth) * 1000) / 1000;
    selectedDesign.height =
      Math.round((newHeight / regionHeight) * 1000) / 1000;
  } else {
    selectedDesign.x = posX / regionWidth;
    selectedDesign.y = posX / regionWidth;
  }
  return selectedDesign;
}

export function duplicateDesign(
  designId,
  activeView,
  setDesignsByView,
  regionWidth,
  regionHeight,
  setSelectedDesignId,
  getBoundingBox,
) {
  setDesignsByView((prev) => {
    const designs = prev[activeView] || [];
    const original = designs.find((d) => d.id === designId);
    if (!original) return prev;

    const highestZ = designs.length
      ? Math.max(...designs.map((d) => d.layer || 0))
      : 0;

    const newId = `${designId}-copy-${Date.now()}`;

    // default offset (10px normalized)
    let offsetX = 10 / regionWidth;
    let offsetY = 10 / regionHeight;

    const bbox = getBoundingBox(
      original.width * Math.min(regionWidth, regionHeight),
      original.height * Math.min(regionWidth, regionHeight),
      original.rotation,
    );
    const bboxWidthNorm = bbox.width / regionWidth;
    const bboxHeightNorm = bbox.height / regionHeight;
    // Right overflow
    if (original.x + offsetX + bboxWidthNorm > 1) {
      offsetX = -10 / regionWidth;
    }
    // Left overflow
    if (original.x + offsetX < 0) {
      offsetX = 0;
    }
    // Bottom overflow
    if (original.y + offsetY + bboxHeightNorm > 1) {
      offsetY = -10 / regionHeight;
    }
    // Top overflow
    if (original.y + offsetY < 0) {
      offsetY = 0;
    }

    const duplicate = {
      ...original,
      id: newId,
      x: original.x + offsetX,
      y: original.y + offsetY,
      layer: highestZ + 1,
    };

    const updated = [...designs, duplicate];

    // auto-select the duplicate
    setSelectedDesignId(newId);

    return {
      ...prev,
      [activeView]: updated,
    };
  });
}

export function updateSizeClamped(
  designId,
  newWidthNorm,
  newHeightNorm,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
) {
  setDesignsByView((prev) => {
    const updated = prev[activePreview].map((item) => {
      if (item.id !== designId) return item;

      let finalWidth = newWidthNorm * regionWidth;
      let finalHeight = newHeightNorm * regionHeight;

      // rotated bounding box for new size
      let bbox = getBoundingBox(
        newWidthNorm * Math.min(regionWidth, regionHeight),
        newHeightNorm * Math.min(regionWidth, regionHeight),
        item.rotation,
      );

      // current top-left in pixels
      let posX = item.x * regionWidth;
      let posY = item.y * regionHeight;

      // clamp position so bbox stays inside region
      if (posX + bbox.width > regionWidth) {
        finalWidth = item.width * regionWidth;
        if (item.isLocked_aspect_ratio) {
          return {
            ...item,
            width: item.width,
            height: item.height,
          };
        }
      }
      if (posY + bbox.height > regionHeight) {
        finalHeight = item.height * regionHeight;
        if (item.isLocked_aspect_ratio) {
          return {
            ...item,
            width: item.width,
            height: item.height,
          };
        }
      }

      return {
        ...item,
        width: Math.round((finalWidth / regionWidth) * 1000) / 1000,
        height: Math.round((finalHeight / regionHeight) * 1000) / 1000,
      };
    });

    return { ...prev, [activePreview]: updated };
  });
}

export function updateSize(
  designId,
  newWidthNorm,
  newHeightNorm,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
) {
  setDesignsByView((prev) => {
    const updated = prev[activePreview].map((item) => {
      if (item.id !== designId) return item;

      let finalWidth = newWidthNorm * regionWidth;
      let finalHeight = newHeightNorm * regionHeight;

      // rotated bounding box for new size
      let bbox = getBoundingBox(
        newWidthNorm * Math.min(regionWidth, regionHeight),
        newHeightNorm * Math.min(regionWidth, regionHeight),
        item.rotation,
      );

      // current top-left in pixels
      let posX = item.x * regionWidth;
      let posY = item.y * regionHeight;

      // clamp size if bbox exceeds region
      if (bbox.width > regionWidth || bbox.height > regionHeight) {
        const widthRatio = regionWidth / bbox.width;
        const heightRatio = regionHeight / bbox.height;
        const scale = Math.min(widthRatio, heightRatio);

        finalWidth = finalWidth * scale;
        finalHeight = finalHeight * scale;

        bbox = getBoundingBox(finalWidth, finalHeight, item.rotation);
      }

      // clamp position so bbox stays inside region
      if (posX + bbox.width > regionWidth) {
        posX = regionWidth - bbox.width;
      }
      if (posX < 0) {
        posX = 0;
      }
      if (posY + bbox.height > regionHeight) {
        posY = regionHeight - bbox.height;
      }
      if (posY < 0) {
        posY = 0;
      }

      return {
        ...item,
        width: Math.round((finalWidth / regionWidth) * 1000) / 1000,
        height: Math.round((finalHeight / regionHeight) * 1000) / 1000,
        x: posX / regionWidth,
        y: posY / regionHeight,
      };
    });

    return { ...prev, [activePreview]: updated };
  });
}

export function center(
  designId,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
) {
  setDesignsByView((prev) => {
    const updated = prev[activePreview].map((item) => {
      if (item.id !== designId) return item;

      const bbox = getBoundingBox(
        item.width * Math.min(regionWidth, regionHeight),
        item.height * Math.min(regionWidth, regionHeight),
        item.rotation,
      );

      const centeredX = (regionWidth - bbox.width) / 2;

      return {
        ...item,
        x: centeredX / regionWidth,
      };
    });

    return {
      ...prev,
      [activePreview]: updated,
    };
  });
}

export function handleToggleAspectLock(
  selectedDesign,
  activePreview,
  setDesignsByView,
  getBoundingBox,
  regionWidth,
  regionHeight,
) {
  setDesignsByView((prev) => {
    const updated = prev[activePreview].map((item) => {
      if (item.id !== selectedDesign.id) return item;

      const newLock = !item.isLocked_aspect_ratio;

      // If re-locking, restore original aspect ratio safely
      if (newLock) {
        const aspect = item.aspect_ratio;
        let newWidthPx = item.width * Math.min(regionWidth, regionHeight);
        let newHeightPx = newWidthPx / aspect;

        if (newWidthPx / regionWidth < 0.05) {
          newWidthPx = 0.05 * Math.min(regionWidth, regionHeight);
          newHeightPx = newWidthPx / aspect;
        }

        if (newHeightPx / regionHeight < 0.05) {
          newHeightPx = 0.05 * Math.min(regionWidth, regionHeight);
          newWidthPx = newHeightPx * aspect;
        }

        // clamp both dimensions simultaneously
        if (newWidthPx > regionWidth || newHeightPx > regionHeight) {
          const widthRatio = regionWidth / newWidthPx;
          const heightRatio = regionHeight / newHeightPx;
          const scale = Math.min(widthRatio, heightRatio);
          newWidthPx *= scale;
          newHeightPx *= scale;
        }

        // clamp position so edges stay inside
        let posX = item.x * regionWidth;
        let posY = item.y * regionHeight;

        if (posX + newWidthPx > regionWidth) posX = regionWidth - newWidthPx;
        if (posX < 0) posX = 0;
        if (posY + newHeightPx > regionHeight)
          posY = regionHeight - newHeightPx;
        if (posY < 0) posY = 0;

        return {
          ...item,
          width: Math.round((newWidthPx / regionWidth) * 1000) / 1000,
          height: Math.round((newHeightPx / regionHeight) * 1000) / 1000,
          x: posX / regionWidth,
          y: posY / regionHeight,
          isLocked_aspect_ratio: newLock, // ✅ update flag here
        };
      }

      // If unlocking, just toggle the flag
      return {
        ...item,
        isLocked_aspect_ratio: newLock,
      };
    });

    return { ...prev, [activePreview]: updated };
  });
}

export const applyCrop = async (
  setDesignsByView,
  activePreview,
  selectedDesign,
  norm,
  getBoundingBox,
  regionWidth,
  regionHeight,
) => {
  const croppedSrc = await generateCroppedImage(selectedDesign.src, norm);
  const newAspect = norm.width / norm.height;

  const prevHeight = selectedDesign.crop["height"];
  const prevWidth = selectedDesign.crop["width"];

  const heightScale = norm.height / prevHeight;
  const widthScale = norm.width / prevWidth;

  let newWidthNorm = selectedDesign.width * widthScale;
  let newHeightNorm = selectedDesign.height * heightScale;

  if (newWidthNorm < 0.05) {
    newWidthNorm = 0.05;
    newHeightNorm = newWidthNorm / newAspect;
  }

  if (newHeightNorm < 0.05) {
    newHeightNorm = 0.05;
    newWidthNorm = newHeightNorm * newAspect;
  }

  let finalWidth = newWidthNorm * regionWidth;
  let finalHeight = newHeightNorm * regionHeight;

  // rotated bounding box for new size
  let bbox = getBoundingBox(
    newWidthNorm * Math.min(regionWidth, regionHeight),
    newHeightNorm * Math.min(regionWidth, regionHeight),
    selectedDesign.rotation,
  );

  // current top-left in pixels
  let posX = selectedDesign.x * regionWidth;
  let posY = selectedDesign.y * regionHeight;

  // clamp size if bbox exceeds region
  if (bbox.width > regionWidth || bbox.height > regionHeight) {
    const widthRatio = regionWidth / bbox.width;
    const heightRatio = regionHeight / bbox.height;
    const scale = Math.min(widthRatio, heightRatio);

    finalWidth = finalWidth * scale;
    finalHeight = finalHeight * scale;

    bbox = getBoundingBox(finalWidth, finalHeight, selectedDesign.rotation);
  }

  // clamp position so bbox stays inside region
  if (posX + bbox.width > regionWidth) {
    posX = regionWidth - bbox.width;
  }
  if (posX < 0) {
    posX = 0;
  }
  if (posY + bbox.height > regionHeight) {
    posY = regionHeight - bbox.height;
  }
  if (posY < 0) {
    posY = 0;
  }

  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === selectedDesign.id
        ? {
            ...item,
            croppedSrc: croppedSrc,
            aspect_ratio: newAspect,
            crop: norm,
            width: Math.round((finalWidth / regionWidth) * 1000) / 1000,
            height: Math.round((finalHeight / regionHeight) * 1000) / 1000,
            x: posX / regionWidth,
            y: posY / regionHeight,
          }
        : item,
    ),
  }));
};

const generateCroppedImage = (imageSrc, crop) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const sx = crop.x * image.width;
      const sy = crop.y * image.height;
      const sw = crop.width * image.width;
      const sh = crop.height * image.height;

      canvas.width = sw;
      canvas.height = sh;

      ctx.drawImage(
        image,
        sx,
        sy,
        sw,
        sh, // source (crop area)
        0,
        0,
        sw,
        sh, // destination
      );

      resolve(canvas.toDataURL("image/png"));
    };
  });
};

export async function applyNewTextImg(
  newText,
  newFontFamily,
  isBold,
  isItalic,
  newFontColor,
  newOutlineColor,
  newOutlineSize,
  newTextAlignment,
  newTextShape,
  newShapeIntensity,
  newLineSpacing,
  setDesignsByView,
  activePreview,
  selectedDesign,
  regionWidth,
  regionHeight,
  getBoundingBox,
) {
  const maxFontSizePx = findFittingFontSize(
    newText,
    regionWidth,
    newFontFamily,
    isBold,
    isItalic,
  );

  const imageData = await textWorker.textToImage({
    text: newText,
    fontSizePx: maxFontSizePx,
    fontFamily: newFontFamily,
    isBold: isBold,
    isItalic: isItalic,
    textAlign: newTextAlignment,
    textColor: newFontColor,
    outlineColor: newOutlineColor,
    outlineSize: newOutlineSize,
    textShape: newTextShape,
    shapeIntensity: newShapeIntensity,
    lineHeightMultiplier: newLineSpacing,
  });

  setDesignsByView((prev) => {
    const updated = prev[activePreview].map((item) => {
      if (item.id !== selectedDesign.id) return item;

      let aspect_ratio = imageData.width / imageData.height;

      let finalWidthNorm = item.width;
      if (finalWidthNorm < 0.05) finalWidthNorm = 0.05;

      let finalHeightNorm = finalWidthNorm / aspect_ratio;
      if (finalHeightNorm < 0.05) {
        finalHeightNorm = 0.05;
        finalWidthNorm = finalHeightNorm * aspect_ratio;
      }

      let finalWidth = finalWidthNorm * regionWidth;
      let finalHeight = finalHeightNorm * regionHeight;

      // rotated bounding box for new size
      let bbox = getBoundingBox(
        finalWidthNorm * Math.min(regionWidth, regionHeight),
        finalHeightNorm * Math.min(regionWidth, regionHeight),
        item.rotation,
      );

      // current top-left in pixels
      let posX = item.x * regionWidth;
      let posY = item.y * regionHeight;

      // clamp size if bbox exceeds region
      if (bbox.width > regionWidth || bbox.height > regionHeight) {
        const widthRatio = regionWidth / bbox.width;
        const heightRatio = regionHeight / bbox.height;
        const scale = Math.min(widthRatio, heightRatio);

        finalWidth = finalWidth * scale;
        finalHeight = finalHeight * scale;

        bbox = getBoundingBox(finalWidth, finalHeight, item.rotation);
      }

      // clamp position so bbox stays inside region
      if (posX + bbox.width > regionWidth) {
        posX = regionWidth - bbox.width;
      }
      if (posX < 0) {
        posX = 0;
      }
      if (posY + bbox.height > regionHeight) {
        posY = regionHeight - bbox.height;
      }
      if (posY < 0) {
        posY = 0;
      }

      return {
        ...item,
        text: newText,
        src: imageData.img,
        width: Math.round((finalWidth / regionHeight) * 1000) / 1000,
        height: Math.round((finalHeight / regionHeight) * 1000) / 1000,
        aspect_ratio: aspect_ratio,
        x: posX / regionWidth,
        y: posY / regionHeight,

        fontFamily: newFontFamily,
        design_color: newFontColor,
        outline_color: newOutlineColor,
        outline_width: newOutlineSize,
        text_alignment: newTextAlignment,
        text_shape: newTextShape,
        shape_intensity: newShapeIntensity,
        lineSpacing: newLineSpacing,
        isBold: isBold,
        isItalic: isItalic,
      };
    });

    return { ...prev, [activePreview]: updated };
  });
}
