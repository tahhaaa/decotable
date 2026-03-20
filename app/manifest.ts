import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Decotable",
    short_name: "Decotable",
    description: "Decoration, art de table et idees cadeaux premium au Maroc.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F4EE",
    theme_color: "#C4A484",
    lang: "fr",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
