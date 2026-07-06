const ellipseLookupCache = new Map();
const outlineOffsetsCache = new Map();

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

function getEllipseForCurve(referenceWidth, fontSizePx, curveIntensity) {
  const rx = Math.max(referenceWidth / 2, fontSizePx);

  const minRy = fontSizePx * 0.3;
  const maxRy = fontSizePx * 8;

  const ry = minRy + curveIntensity * (maxRy - minRy);

  return {
    rx,
    ry,
  };
}

function getEllipseLookup(rx, ry, reverseCurve) {
  const key = `${Math.round(rx)}_${Math.round(ry)}_${reverseCurve}`;

  let cached = ellipseLookupCache.get(key);

  if (!cached) {
    cached = buildEllipseLookup(rx, ry, reverseCurve);

    ellipseLookupCache.set(key, cached);
  }

  return cached;
}

function getOutlineOffsets(radius) {
  const key = radius;

  let cached = outlineOffsetsCache.get(key);

  if (cached) {
    return cached;
  }

  const offsets = [];

  const radiusSquared = radius * radius;

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      if (dx * dx + dy * dy > radiusSquared) {
        continue;
      }

      offsets.push({
        dx,
        dy,
      });
    }
  }

  outlineOffsetsCache.set(key, offsets);

  return offsets;
}

function buildEllipseLookup(rx, ry, reverseCurve, steps = 200) {
  const lookup = [];

  let totalLength = 0;

  let prevX = -rx;
  let prevY = 0;

  lookup.push({
    t: Math.PI,
    length: 0,
  });

  for (let i = 1; i <= steps; i++) {
    const t = Math.PI - (i / steps) * Math.PI;

    const x = rx * Math.cos(t);

    const y = reverseCurve ? -ry * Math.sin(t) : ry * Math.sin(t);

    totalLength += Math.hypot(x - prevX, y - prevY);

    lookup.push({
      t,
      length: totalLength,
    });

    prevX = x;
    prevY = y;
  }

  return {
    lookup,
    totalLength,
  };
}

function ellipsePoint(cx, cy, rx, ry, t, reverseCurve) {
  return {
    x: cx + rx * Math.cos(t),
    y: cy + (reverseCurve ? -ry * Math.sin(t) : ry * Math.sin(t)),
  };
}

function ellipseTangentAngle(rx, ry, t, reverseCurve) {
  const dx = rx * Math.sin(t);

  const dy = reverseCurve ? ry * Math.cos(t) : -ry * Math.cos(t);

  return Math.atan2(dy, dx);
}

function findTForLength(lookup, targetLength) {
  let low = 0;
  let high = lookup.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;

    if (lookup[mid].length < targetLength) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return lookup[Math.min(low, lookup.length - 1)].t;
}

function drawEllipticalText(
  ctx,
  text,
  cx,
  cy,
  referenceWidth,
  fontSizePx,
  curveIntensity,
  reverseCurve,
  textColor,
  outlineColor,
  outlinePx,
) {
  const chars = text.split("");

  const widths = chars.map((c) => ctx.measureText(c).width);

  const totalTextWidth = widths.reduce((a, b) => a + b, 0);

  const { rx, ry } = getEllipseForCurve(
    referenceWidth,
    fontSizePx,
    curveIntensity,
  );

  const { lookup, totalLength } = getEllipseLookup(rx, ry, reverseCurve);

  const referenceStartLength = (totalLength - referenceWidth) / 2;

  const startLength =
    referenceStartLength + (referenceWidth - totalTextWidth) / 2;

  let currentLength = startLength;

  const glyphs = [];

  chars.forEach((char, index) => {
    const width = widths[index];

    const centerLength = currentLength + width / 2;

    const t = findTForLength(lookup, centerLength);

    const point = ellipsePoint(cx, cy, rx, ry, t, reverseCurve);

    let angle = ellipseTangentAngle(rx, ry, t, reverseCurve);

    // keep characters upright
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
      angle += Math.PI;
    }

    glyphs.push({
      char,
      width,
      x: point.x,
      y: point.y,
      angle,
    });

    currentLength += width;
  });

  // ==========================
  // PASS 1 - DRAW OUTLINES
  // ==========================
  if (outlinePx && outlineColor) {
    ctx.fillStyle = outlineColor.rgb;

    const radius = Math.max(1, Math.round(outlinePx));

    const offsets = getOutlineOffsets(radius);

    glyphs.forEach((glyph) => {
      ctx.save();

      ctx.translate(glyph.x, glyph.y);

      ctx.rotate(glyph.angle);

      offsets.forEach(({ dx, dy }) => {
        ctx.fillText(glyph.char, -glyph.width / 2 + dx, dy);
      });

      ctx.restore();
    });
  }

  // ==========================
  // PASS 2 - DRAW FILLS
  // ==========================
  ctx.fillStyle = textColor.rgb;

  glyphs.forEach((glyph) => {
    ctx.save();

    ctx.translate(glyph.x, glyph.y);

    ctx.rotate(glyph.angle);

    ctx.fillText(glyph.char, -glyph.width / 2, 0);

    ctx.restore();
  });
}

function cropCanvas(canvas, cropPadding = 10) {
  const ctx = canvas.getContext("2d");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];

      if (alpha > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX > maxX || minY > maxY) {
    return canvas;
  }

  const cropX = Math.max(0, minX - cropPadding);

  const cropY = Math.max(0, minY - cropPadding);

  const cropWidth = Math.min(
    canvas.width - cropX,
    maxX - minX + 1 + cropPadding * 2,
  );

  const cropHeight = Math.min(
    canvas.height - cropY,
    maxY - minY + 1 + cropPadding * 2,
  );

  const croppedCanvas = document.createElement("canvas");

  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  croppedCanvas
    .getContext("2d")
    .drawImage(
      canvas,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

  return croppedCanvas;
}

function canvasToResult(canvas) {
  const croppedCanvas = cropCanvas(canvas);

  return {
    img: croppedCanvas.toDataURL("image/png"),
    width: croppedCanvas.width,
    height: croppedCanvas.height,
  };
}

export const textToImage = ({
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
  textShape,
  shapeIntensity,
}) => {
  const lines = text.split("\n");

  if (textShape === "curve") {
    let reverseCurve = false;
    if (shapeIntensity < 0) {
      shapeIntensity = -shapeIntensity;
      reverseCurve = true;
    }
    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    const fontWeight = isBold ? "bold" : "normal";

    const fontStyle = isItalic ? "italic" : "normal";

    ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;

    const outlinePx = outlineSize > 0 ? (outlineSize * fontSizePx) / 12 : 0;

    const lineHeight = fontSizePx * lineHeightMultiplier;

    const lineSpacing = lineHeight + fontSizePx * 0.5;

    let widestLineWidth = 0;

    lines.forEach((line) => {
      widestLineWidth = Math.max(widestLineWidth, ctx.measureText(line).width);
    });

    const { rx, ry } = getEllipseForCurve(
      widestLineWidth,
      fontSizePx,
      shapeIntensity,
    );

    canvas.width = rx * 2 + fontSizePx * 4 + outlinePx * 4;

    canvas.height =
      ry + lines.length * lineSpacing + fontSizePx * 4 + outlinePx * 4;

    ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;
    ctx.textBaseline = "middle";

    lines.forEach((line, index) => {
      drawEllipticalText(
        ctx,
        line,
        canvas.width / 2,
        ry + fontSizePx + index * lineSpacing,

        widestLineWidth,
        fontSizePx,
        shapeIntensity,
        reverseCurve,

        textColor,
        outlineColor,
        outlinePx,
      );
    });

    return canvasToResult(canvas);
  }

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
      metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
    );

    maxAscent = Math.max(maxAscent, metrics.actualBoundingBoxAscent);

    maxDescent = Math.max(maxDescent, metrics.actualBoundingBoxDescent);
  }

  const outlinePx = outlineSize > 0 ? (outlineSize * fontSizePx) / 12 : 0;

  const padding = Math.max(6, Math.ceil(outlinePx));

  const topMargin = Math.ceil(fontSizePx * 0.2);

  const bottomMargin = Math.ceil(fontSizePx * 0.2);

  canvas.width = Math.ceil(maxWidth + padding * 2 + outlinePx * 2);

  canvas.height = Math.ceil(
    lines.length * lineHeight +
      padding * 2 +
      topMargin +
      bottomMargin +
      outlinePx * 2,
  );

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

  // OUTLINE PASS
  if (outlinePx && outlineColor) {
    ctx.fillStyle = outlineColor.rgb;

    const radius = Math.max(1, Math.round(outlinePx));

    lines.forEach((line, i) => {
      const x = getX();

      const y = padding + topMargin + outlinePx + maxAscent + i * lineHeight;

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (dx === 0 && dy === 0) continue;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > radius) continue;

          ctx.fillText(line, x + dx, y + dy);
        }
      }
    });
  }

  // FILL PASS
  ctx.fillStyle = textColor.rgb;

  lines.forEach((line, i) => {
    const x = getX();

    const y = padding + topMargin + outlinePx + maxAscent + i * lineHeight;

    ctx.fillText(line, x, y);
  });

  return canvasToResult(canvas);
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
