import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F4EE",
          color: "#000000",
          fontSize: 96,
          borderRadius: 40,
          border: "2px solid rgba(0,0,0,0.12)",
        }}
      >
        D
      </div>
    ),
    size,
  );
}
