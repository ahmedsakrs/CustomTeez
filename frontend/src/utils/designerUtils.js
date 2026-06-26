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
    selectedDesign.width * Math.min(regionWidth, regionHeight),
    (selectedDesign.width / selectedDesign.aspect_ratio) *
      Math.min(regionWidth, regionHeight),
    angle,
  );
  let posX = selectedDesign.x * regionWidth;
  let posY = selectedDesign.y * regionHeight;

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

    const newWidth = selectedDesign.width * regionWidth * scale;
    const newHeight =
      (selectedDesign.width / selectedDesign.aspect_ratio) *
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
        item.id === selectedDesign.id
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
        item.id === selectedDesign.id
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
          height: (newHeightPx / Math.min(regionWidth, regionHeight)).toFixed(3),
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
