"use client";

import { useMemo, useState } from "react";
import AppShell from "@/features/checkin/components/AppShell";
import MaskOverlay from "@/features/checkin/components/MaskOverlay";
import { makeMockMask } from "@/features/checkin/utils/mockMask";

export default function CheckInPage() {
  const [file, setFile] = useState<File | null>(null);

  const [mask, setMask] = useState<Uint8Array | null>(null);
  const [maskW, setMaskW] = useState(0);
  const [maskH, setMaskH] = useState(0);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  function onScan() {
    // today: mock mask (tomorrow: ONNX output)
    const m = makeMockMask(256, 256);
    setMask(m.mask);
    setMaskW(m.width);
    setMaskH(m.height);
  }

  return (
    <AppShell title="New Check-in">
      <div style={{ display: "grid", gap: 12, maxWidth: 760 }}>
        <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Upload a photo</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setMask(null);
              setMaskW(0);
              setMaskH(0);
            }}
          />
          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <button
              onClick={onScan}
              disabled={!previewUrl}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: previewUrl ? "#fff" : "#f5f5f5",
                cursor: previewUrl ? "pointer" : "not-allowed",
                fontWeight: 600,
              }}
            >
              Scan (MVP)
            </button>
            <div style={{ fontSize: 12, color: "#666", alignSelf: "center" }}>
              Today this is a mock mask. Next step is ONNX segmentation output.
            </div>
          </div>
        </div>

        {previewUrl && (
          <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Preview</div>

            {!mask ? (
              <img
                src={previewUrl}
                alt="preview"
                style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid #f0f0f0" }}
              />
            ) : (
              <MaskOverlay imageUrl={previewUrl} mask={mask} maskWidth={maskW} maskHeight={maskH} />
            )}

            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              Overlay = region-of-interest mask (redaction/segmentation step).
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
