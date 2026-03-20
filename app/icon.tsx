import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 20,
          borderRadius: 9999,
          border: "1px solid rgba(0,0,0,0.12)",
          fontFamily: "Georgia, serif",
        }}
      >
        DT
      </div>
    ),
    size,
  );
}
