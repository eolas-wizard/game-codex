export const REGIONS = [
  {
    id: "windswept-hills",
    name: "Windswept Hills",
    mark: "WH",
    description: "Open grasslands, old ruins, and the beginning of the journey.",
    swatchA: "#9eaf62",
    swatchB: "#4f6b49"
  },
  {
    id: "bamboo-groves",
    name: "Bamboo Groves",
    mark: "BG",
    description: "Dense green corridors and hidden paths.",
    swatchA: "#70b990",
    swatchB: "#356b56"
  },
  {
    id: "verdant-brook",
    name: "Verdant Brook",
    mark: "VB",
    description: "Waterways, forest edges, and layered exploration.",
    swatchA: "#6eb8bf",
    swatchB: "#3e747b"
  },
  {
    id: "obsidian-mountain",
    name: "Obsidian Mountain",
    mark: "OM",
    description: "Volcanic terrain, heat, and dangerous routes.",
    swatchA: "#d57d4d",
    swatchB: "#713928"
  },
  {
    id: "astral-mountains",
    name: "Astral Mountains",
    mark: "AM",
    description: "Cold heights, crystalline color, and expedition atmosphere.",
    swatchA: "#8d98d8",
    swatchB: "#4d5488"
  },
  {
    id: "dessicated-desert",
    name: "Dessicated Desert",
    mark: "DD",
    description: "Ancient sands, exposed routes, and severe conditions.",
    swatchA: "#d2aa60",
    swatchB: "#8b6636"
  },
  {
    id: "sakurajima",
    name: "Sakurajima",
    mark: "SJ",
    description: "Blooming color, dramatic elevation, and hidden encounters.",
    swatchA: "#dc9bb6",
    swatchB: "#8c5a70"
  },
  {
    id: "feybreak",
    name: "Feybreak",
    mark: "FB",
    description: "Otherworldly terrain with a darker expedition tone.",
    swatchA: "#9d80c9",
    swatchB: "#5b477c"
  }
];

export function getRegion(id) {
  return REGIONS.find((region) => region.id === id) ?? REGIONS[0];
}
