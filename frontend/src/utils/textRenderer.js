const ellipseLookupCache = new Map();
const outlineOffsetsCache = new Map();

export const findFittingFontSize = (
  text,
  targetWidthPx,
  fontFamily = "Arial",
  isBold = false,
  isItalic = false,
) => {
  const canvas = new OffscreenCanvas(targetWidthPx, targetWidthPx);
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

function getCenterNormal(reverseCurve) {
  return reverseCurve ? { x: 0, y: -1 } : { x: 0, y: 1 };
}

function buildArchGlyphs(
  ctx,
  text,
  cx,
  cy,
  lineOffset,
  fontSizePx,
  shapeIntensity,
  reverseCurve,
) {
  const chars = text.split("");

  const widths = chars.map((c) => ctx.measureText(c).width);

  const totalTextWidth = widths.reduce((a, b) => a + b, 0);

  const radius = Math.max(
    totalTextWidth / (Math.max(shapeIntensity, 0.15) * Math.PI * 1.5),
    fontSizePx * 2.5,
  );

  const totalAngle = shapeIntensity * Math.PI;

  let currentOffset = -totalTextWidth / 2;

  const glyphs = [];

  chars.forEach((char, index) => {
    const width = widths[index];

    const centerOffset = currentOffset + width / 2;

    let angle = 0;

    if (totalTextWidth > 0) {
      angle = totalAngle * (centerOffset / totalTextWidth);
    }

    const drawAngle = reverseCurve ? -angle : angle;

    const x = cx + radius * Math.sin(drawAngle);

    const y = cy - radius * Math.cos(drawAngle);

    const t = totalAngle === 0 ? 0 : angle / (totalAngle / 2);

    const rotation = drawAngle * 0.35;

    const scaleX = 1 + Math.abs(t) * shapeIntensity * 0.2;

    glyphs.push({
      char,
      width,
      x,
      y: y + lineOffset,
      t,
      rotation,
    });

    currentOffset += width * scaleX + fontSizePx * 0.1;
  });

  return {
    glyphs,
    radius,
  };
}

function drawArchGlyphOutlines(
  ctx,
  glyphs,
  outlineColor,
  outlinePx,
  shapeIntensity,
) {
  if (!outlinePx || !outlineColor) {
    return;
  }

  ctx.fillStyle = outlineColor.rgb;

  const radius = Math.max(1, Math.round(outlinePx));

  const offsets = getOutlineOffsets(radius);

  glyphs.forEach((glyph) => {
    ctx.save();

    ctx.translate(glyph.x, glyph.y);

    ctx.rotate(glyph.rotation);

    const skewAmount = glyph.t * shapeIntensity * 0.35;

    const scaleX = 1 + Math.abs(glyph.t) * shapeIntensity * 0.2;

    ctx.transform(1, 0, skewAmount, 1, 0, 0);

    ctx.scale(scaleX, 1);

    offsets.forEach(({ dx, dy }) => {
      ctx.fillText(glyph.char, -glyph.width / 2 + dx, dy);
    });

    ctx.restore();
  });
}

function drawArchGlyphFills(ctx, glyphs, textColor, shapeIntensity) {
  ctx.fillStyle = textColor.rgb;

  glyphs.forEach((glyph) => {
    ctx.save();

    ctx.translate(glyph.x, glyph.y);

    ctx.rotate(glyph.rotation);

    const skewAmount = glyph.t * shapeIntensity * 0.35;

    const scaleX = 1 + Math.abs(glyph.t) * shapeIntensity * 0.2;

    ctx.transform(1, 0, skewAmount, 1, 0, 0);

    ctx.scale(scaleX, 1);

    ctx.fillText(glyph.char, -glyph.width / 2, 0);

    ctx.restore();
  });
}

function buildEllipticalGlyphs(
  ctx,
  text,
  cx,
  cy,
  referenceWidth,
  fontSizePx,
  curveIntensity,
  reverseCurve,
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

  return glyphs;
}

function drawGlyphOutlines(ctx, glyphs, outlineColor, outlinePx) {
  if (!outlinePx || !outlineColor) {
    return;
  }

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

function drawGlyphFills(ctx, glyphs, textColor) {
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

  const croppedCanvas = new OffscreenCanvas(cropWidth, cropHeight);

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

async function canvasToResult(canvas) {
  const croppedCanvas = cropCanvas(canvas);

  const blob = await croppedCanvas.convertToBlob({
    type: "image/png",
  });

  const buffer = await blob.arrayBuffer();

  const bytes = new Uint8Array(buffer);

  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return {
    img: `data:image/png;base64,${btoa(binary)}`,
    width: croppedCanvas.width,
    height: croppedCanvas.height,
  };
}

export async function textToImage({
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
}) {
  const lines = text.split("\n");

  if (textShape === "curve") {
    let reverseCurve = false;
    if (shapeIntensity < 0) {
      shapeIntensity = -shapeIntensity;
      reverseCurve = true;
    }
    const canvas = new OffscreenCanvas(1, 1);

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

    const topPadding = reverseCurve ? ry : fontSizePx;

    const baseCurveY = topPadding + ry + fontSizePx;

    canvas.height =
      topPadding +
      ry * 2 +
      fontSizePx * 4 +
      outlinePx * 4 +
      (lines.length - 1) * lineSpacing * 2;

    ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;
    ctx.textBaseline = "middle";

    const allGlyphs = [];

    lines.forEach((line, index) => {
      const lineGlyphs = buildEllipticalGlyphs(
        ctx,
        line,
        canvas.width / 2,
        baseCurveY + index * lineSpacing * 0.15,
        widestLineWidth,
        fontSizePx,
        shapeIntensity,
        reverseCurve,
      );

      const centerNormal = getCenterNormal(reverseCurve);

      lineGlyphs.forEach((glyph) => {
        glyph.x += centerNormal.x * index * lineSpacing;

        glyph.y += centerNormal.y * index * lineSpacing;
      });

      allGlyphs.push(...lineGlyphs);
    });

    // ALL OUTLINES FIRST
    drawGlyphOutlines(ctx, allGlyphs, outlineColor, outlinePx);

    // THEN ALL FILLS
    drawGlyphFills(ctx, allGlyphs, textColor);

    return await canvasToResult(canvas);
  }

  if (textShape === "arch") {
    let reverseCurve = false;

    if (shapeIntensity < 0) {
      shapeIntensity = -shapeIntensity;

      reverseCurve = true;
    }

    const canvas = new OffscreenCanvas(1, 1);

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

    const radius = Math.max(
      widestLineWidth / (Math.max(shapeIntensity, 0.15) * Math.PI * 1.5),
      fontSizePx * 2.5,
    );

    const curveHeight =
      Math.max(
        fontSizePx,
        radius * (1 - Math.cos((shapeIntensity * Math.PI) / 2)),
      ) * 0.8;

    canvas.width = widestLineWidth + fontSizePx * 8 + outlinePx * 4;

    canvas.height =
      curveHeight +
      fontSizePx * 6 +
      outlinePx * 4 +
      (lines.length - 1) * lineSpacing;

    ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;
    ctx.textBaseline = "middle";

    const allGlyphs = [];

    lines.forEach((line, index) => {
      const { glyphs } = buildArchGlyphs(
        ctx,
        line,
        canvas.width / 2,
        radius + fontSizePx,
        index * lineSpacing,
        fontSizePx,
        shapeIntensity,
        reverseCurve,
      );

      allGlyphs.push(...glyphs);
    });

    drawArchGlyphOutlines(
      ctx,
      allGlyphs,
      outlineColor,
      outlinePx,
      shapeIntensity,
    );

    drawArchGlyphFills(ctx, allGlyphs, textColor, shapeIntensity);

    return await canvasToResult(canvas);
  }

  const canvas = new OffscreenCanvas(1, 1);
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

  return await canvasToResult(canvas);
}
