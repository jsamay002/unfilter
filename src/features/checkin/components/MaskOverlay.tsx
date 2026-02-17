"use client";

import { useEffect, useRef } from "react";

type Props = {
  imageUrl: string;
  mask: Uint8Array | null; // 0/1 values
  maskWidth: number;
  maskHeight: number;
  opacity?: number; // 0..1
};

export default function MaskOverlay({
  imageUrl,
  mask,
  maskWidth,
  maskHeight,
  opacity = 0.35,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas to the image's displayed resolution
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;

      // Draw base image
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      if (!mask || maskWidth <= 0 || maskHeight <= 0) return;

      // Draw mask overlay as RGBA imageData scaled to image size
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = maskWidth;
      maskCanvas.height = maskHeight;
      const mctx = maskCanvas.getContext("2d");
      if (!mctx) return;

      const imgData = mctx.createImageData(maskWidth, maskHeight);
      for (let i = 0; i < maskWidth * maskHeight; i++) {
        const on = mask[i] === 1;
        const p = i * 4;
        if (on) {
          // red overlay pixel
          imgData.data[p + 0] = 255;
          imgData.data[p + 1] = 0;
          imgData.data[p + 2] = 0;
          imgData.data[p + 3] = Math.floor(255 * opacity);
        } else {
          imgData.data[p + 3] = 0;
        }
      }
      mctx.putImageData(imgData, 0, 0);

      // Composite overlay scaled to full image
      ctx.drawImage(maskCanvas, 0, 0, w, h);
    };

    img.src = imageUrl;
  }, [imageUrl, mask, maskWidth, maskHeight, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        display: "block",
      }}
    />
  );
}
