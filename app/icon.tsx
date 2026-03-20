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
          background: "#FFFFFF",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 320 320">
          <rect width="320" height="320" fill="#FFFFFF" />
          <path d="M72 118 160 50l88 68" fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M86 130v86h26" fill="none" stroke="#C4A484" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M234 130v86h-26" fill="none" stroke="#C4A484" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M160 54v48" fill="none" stroke="#C4A484" strokeWidth="5" strokeLinecap="round" />
          <path d="M160 104c0-4 3-7 7-7s7 3 7 7" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />
          <path d="M143 112c3-11 13-18 24-18s21 7 24 18" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M141 113h50" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />
          <path d="M160 129c7 8 10 16 10 25 0 12-6 22-10 27-4-5-10-15-10-27 0-9 3-17 10-25Zm0 12c-3 5-5 10-5 15 0 7 3 13 5 17 2-4 5-10 5-17 0-5-2-10-5-15Z" fill="#C4A484" />
          <path d="M148 159h24l4 20h-32l4-20Z" fill="none" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
          <rect x="124" y="184" width="72" height="18" rx="2" fill="none" stroke="#000" strokeWidth="6" />
          <rect x="135" y="192" width="50" height="6" rx="2" fill="#000" />
          <path d="M142 202l-12 40" fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round" />
          <path d="M156 202l-8 40" fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round" />
          <path d="M178 202l8 40" fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
