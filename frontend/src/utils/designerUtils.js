import ReactDOMServer from "react-dom/server";
import ReactCurvedText from "react-curved-text";

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
  getBoundingBox,
  regionWidth,
  regionHeight,
  check = false,
) => {
  if (!isNaN(angleRad)) {
    if (angleRad !== 0 && !d.isLocked_aspect_ratio) {
      handleToggleAspectLock(
        d,
        activePreview,
        setDesignsByView,
        getBoundingBox,
        regionWidth,
        regionHeight,
      );
    }
    if (check) {
      checkAfterRotation(
        getBoundingBox,
        d,
        activePreview,
        regionWidth,
        regionHeight,
        setDesignsByView,
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
            }
          : item,
      ),
    }));
  }
};

export function radToDeg(angleRad) {
  let degrees = angleRad * (180 / Math.PI);
  while (degrees > 180) degrees -= 360;
  while (degrees < -180) degrees += 360;
  return degrees;
}

export function checkAfterRotation(
  getBoundingBox,
  selectedDesign,
  activePreview,
  regionWidth,
  regionHeight,
  setDesignsByView,
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

    setDesignsByView((prev) => ({
      ...prev,
      [activePreview]: prev[activePreview].map((item) =>
        item.id === selectedDesign?.id
          ? {
              ...item,
              x: posX / regionWidth,
              y: posY / regionHeight,
              width: (newWidth / regionWidth).toFixed(3),
              height: (newHeight / regionHeight).toFixed(3),
            }
          : item,
      ),
    }));
  } else {
    setDesignsByView((prev) => ({
      ...prev,
      [activePreview]: prev[activePreview].map((item) =>
        item.id === selectedDesign?.id
          ? {
              ...item,
              x: posX / regionWidth,
              y: posY / regionHeight,
            }
          : item,
      ),
    }));
  }
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
    selectedDesign.width = (newWidth / regionWidth).toFixed(3);
    selectedDesign.height = (newHeight / regionWidth).toFixed(3);
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

    // check boundaries for X
    if (original.x + offsetX + original.width > 1) {
      // would overflow to the right, flip offset left
      offsetX = -10 / regionWidth;
    }
    if (original.x + offsetX < 0) {
      // would overflow to the left, reset to 0
      offsetX = 0;
    }

    // check boundaries for Y
    if (original.y + offsetY + original.height > 1) {
      // would overflow bottom, flip offset up
      offsetY = -10 / regionHeight;
    }
    if (original.y + offsetY < 0) {
      // would overflow top, reset to 0
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
        width: (finalWidth / regionWidth).toFixed(3),
        height: (finalHeight / regionHeight).toFixed(3),
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
        width: (finalWidth / regionWidth).toFixed(3),
        height: (finalHeight / regionHeight).toFixed(3),
        x: posX / regionWidth,
        y: posY / regionHeight,
      };
    });

    return { ...prev, [activePreview]: updated };
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
          width: (newWidthPx / Math.min(regionWidth, regionHeight)).toFixed(3),
          height: (newHeightPx / Math.min(regionWidth, regionHeight)).toFixed(
            3,
          ),
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
  updateSize(
    selectedDesign.id,
    selectedDesign.width * widthScale,
    selectedDesign.height * heightScale,
    setDesignsByView,
    activePreview,
    getBoundingBox,
    regionWidth,
    regionHeight,
  );

  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === selectedDesign.id
        ? {
            ...item,
            croppedSrc: croppedSrc,
            aspect_ratio: newAspect,
            crop: norm,
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

export const findFittingFontSize = (
  text,
  targetWidthPx,
  fontFamily = "Arial",
  isBold = false,
  isItalic = false,
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const lines = text.split("\n");
  let low = 1;
  let high = 300;
  let fittingSize = low;

  const fontWeight = isBold ? "bold" : "normal";
  const fontStyle = isItalic ? "italic" : "normal";

  while (low <= high) {
    const mid = (low + high) / 2;
    ctx.font = `${fontStyle} ${fontWeight} ${mid}px ${fontFamily}`;

    // measure the widest line
    let maxLineWidth = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      if (metrics.width > maxLineWidth) {
        maxLineWidth = metrics.width;
      }
    }

    if (maxLineWidth <= targetWidthPx * 15) {
      fittingSize = mid; // fits, try bigger
      low = mid + 0.2;
    } else {
      high = mid - 0.2; // too big, try smaller
    }
  }

  return fittingSize;
};

export const curvedTextToImage = async ({
  text,
  fontSizePx,
  fontFamily,
  textColor,
  shapeIntensity,
  isBold,
  isItalic,
}) => {
  const width = 1000;
  const height = 500;

  const radius = 150 + Math.abs(shapeIntensity) * 200;

  const svgString = ReactDOMServer.renderToStaticMarkup(
    <ReactCurvedText
      width={width}
      height={height}
      cx={width / 2}
      cy={height / 2 + 50}
      rx={radius}
      ry={radius}
      startOffset={0}
      reversed={shapeIntensity < 0}
      text={text}
      textProps={{
        style: {
          fill: textColor,
          fontFamily: fontFamily,
          fontSize: fontSizePx,
          fontWeight: isBold ? "bold" : "normal",
          fontStyle: isItalic ? "italic" : "normal",
        },
      }}
    />,
  );

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(svgBlob);

  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      resolve({
        img: canvas.toDataURL("image/png"),
        width,
        height,
      });
    };

    img.src = url;
  });
};

export const textToImage = async ({
  text,
  fontSizePx,
  fontFamily = "Arial",
  isBold = false,
  isItalic = false,
  lineHeightMultiplier = 1,
  textAlign = "center",
  textColor,
  outlineColor,
  outlineSize = 0,
}) => {
  const lines = text.split("\n");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const fontWeight = isBold ? "bold" : "normal";
  const fontStyle = isItalic ? "italic" : "normal";

  ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;

  const lineHeight = fontSizePx * lineHeightMultiplier;

  let maxWidth = 0;
  let maxAscent = 0;
  let maxDescent = 0;

  for (const line of lines) {
    const metrics = ctx.measureText(line);

    maxWidth = Math.max(
      maxWidth,
      metrics.actualBoundingBoxLeft +
        metrics.actualBoundingBoxRight
    );

    maxAscent = Math.max(
      maxAscent,
      metrics.actualBoundingBoxAscent
    );

    maxDescent = Math.max(
      maxDescent,
      metrics.actualBoundingBoxDescent
    );
  }

  const outlinePx =
    outlineSize > 0
      ? (outlineSize * fontSizePx) / 12
      : 0;

  const padding = Math.max(
    6,
    Math.ceil(outlinePx)
  );

  const topMargin = Math.ceil(fontSizePx * 0.2);
  const bottomMargin = Math.ceil(fontSizePx * 0.2);

  canvas.width = Math.ceil(
    maxWidth +
      padding * 2 +
      outlinePx * 2
  );

  canvas.height = Math.ceil(
    lines.length * lineHeight +
      padding * 2 +
      topMargin +
      bottomMargin +
      outlinePx * 2
  );

  // Canvas resize resets settings
  ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;
  ctx.textAlign = textAlign;
  ctx.textBaseline = "alphabetic";

  const getX = () => {
    switch (textAlign) {
      case "center":
        return canvas.width / 2;

      case "right":
        return canvas.width - padding - outlinePx;

      default:
        return padding + outlinePx;
    }
  };

  // --------------------------
  // PASS 1: Draw all outlines
  // --------------------------
  if (outlinePx && outlineColor) {
    ctx.fillStyle = outlineColor.rgb;

    const radius = Math.max(
      1,
      Math.round(outlinePx)
    );

    lines.forEach((line, i) => {
      const x = getX();

      const y =
        padding +
        topMargin +
        outlinePx +
        maxAscent +
        i * lineHeight;

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (dx === 0 && dy === 0) continue;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance > radius) continue;

          ctx.fillText(
            line,
            x + dx,
            y + dy
          );
        }
      }
    });
  }

  // --------------------------
  // PASS 2: Draw all fills
  // --------------------------
  ctx.fillStyle = textColor.rgb;

  lines.forEach((line, i) => {
    const x = getX();

    const y =
      padding +
      topMargin +
      outlinePx +
      maxAscent +
      i * lineHeight;

    ctx.fillText(line, x, y);
  });

  return {
    img: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
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

  const imageData = await textToImage({
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
        width: (finalWidth / regionWidth).toFixed(3),
        height: (finalHeight / regionHeight).toFixed(3),
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
