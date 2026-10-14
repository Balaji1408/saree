export type Occasion = "Wedding" | "Evening" | "Casual" | "Festive";
export type Category = "Dresses" | "Gowns" | "Ethnic";

export type Colour = { name: string; hex: string };

export type Product = {
  id: string;
  name: string;
  images: string[];
  price: number;
  mrp: number;
  fabric: string;
  occasion: Occasion;
  category: Category;
  sizes: string[];
  colors: Colour[];
  isNew?: boolean;
};

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const img = (name: string) => `/images/${name}.jpg`;

export const products: Product[] = [
  {
    id: "rosso-evening-gown",
    name: "Rosso Silk Evening Gown",
    images: [img("gown-red-flow"), img("dress-red-studio")],
    price: 24900,
    mrp: 29900,
    fabric: "Mulberry silk charmeuse, bias-cut with a hand-rolled hem",
    occasion: "Evening",
    category: "Gowns",
    sizes: ALL_SIZES,
    colors: [
      { name: "Rosso", hex: "#B3121F" },
      { name: "Noir", hex: "#1C1512" },
      { name: "Champagne", hex: "#E8D3A8" },
    ],
    isNew: true,
  },
  {
    id: "scarlet-cocktail-dress",
    name: "Scarlet Bloom Cocktail Dress",
    images: [img("dress-cocktail-red"), img("dress-red-studio")],
    price: 12900,
    mrp: 15900,
    fabric: "Floral jacquard brocade with a structured cinched waist",
    occasion: "Evening",
    category: "Dresses",
    sizes: ALL_SIZES,
    colors: [
      { name: "Scarlet", hex: "#C8202F" },
      { name: "Ivory", hex: "#F4EEE3" },
    ],
    isNew: true,
  },
  {
    id: "ivory-bridal-lehenga",
    name: "Ivory Chikankari Bridal Lehenga",
    images: [img("lehenga-ivory"), img("rail-whites")],
    price: 89900,
    mrp: 99900,
    fabric: "Georgette with hand chikankari, sequin and zari work",
    occasion: "Wedding",
    category: "Ethnic",
    sizes: ALL_SIZES,
    colors: [
      { name: "Ivory", hex: "#F1EBDD" },
      { name: "Blush", hex: "#EBC9C0" },
    ],
    isNew: true,
  },
  {
    id: "azure-summer-midi",
    name: "Azure Wrap Summer Midi",
    images: [img("midi-summer-blue"), img("dress-floral")],
    price: 7900,
    mrp: 9500,
    fabric: "Featherweight viscose crepe with a side slit",
    occasion: "Casual",
    category: "Dresses",
    sizes: ALL_SIZES,
    colors: [
      { name: "Azure", hex: "#A9C3D9" },
      { name: "Sand", hex: "#E3D4BC" },
    ],
    isNew: true,
  },
  {
    id: "aubergine-banarasi-saree",
    name: "Aubergine Banarasi Silk Saree",
    images: [img("saree-plum-silk"), img("craft-zari")],
    price: 32500,
    mrp: 36000,
    fabric: "Pure katan silk, handwoven with antique gold zari",
    occasion: "Festive",
    category: "Ethnic",
    sizes: ["Free Size"],
    colors: [
      { name: "Aubergine", hex: "#4B1E3F" },
      { name: "Gold", hex: "#C9A24B" },
    ],
    isNew: true,
  },
  {
    id: "rani-kanjivaram-saree",
    name: "Rani Pink Kanjivaram Saree",
    images: [img("saree-pink-bridal"), img("craft-zari")],
    price: 45900,
    mrp: 52000,
    fabric: "Kanjivaram mulberry silk with a contrast temple border",
    occasion: "Wedding",
    category: "Ethnic",
    sizes: ["Free Size"],
    colors: [
      { name: "Rani Pink", hex: "#D6306E" },
      { name: "Mustard", hex: "#D9A23A" },
    ],
    isNew: true,
  },
  {
    id: "plum-off-shoulder-gown",
    name: "Plum Satin Off-Shoulder Gown",
    images: [img("gown-plum"), img("saree-plum-silk")],
    price: 21900,
    mrp: 25900,
    fabric: "Duchess satin with a sculpted off-shoulder neckline",
    occasion: "Evening",
    category: "Gowns",
    sizes: ALL_SIZES,
    colors: [
      { name: "Plum", hex: "#6B1E4A" },
      { name: "Emerald", hex: "#1F6B57" },
    ],
    isNew: true,
  },
  {
    id: "emerald-chiffon-maxi",
    name: "Emerald Chiffon Maxi",
    images: [img("dress-emerald"), img("midi-summer-blue")],
    price: 11500,
    mrp: 13900,
    fabric: "Double-layer silk chiffon with a tiered skirt",
    occasion: "Casual",
    category: "Dresses",
    sizes: ALL_SIZES,
    colors: [
      { name: "Emerald", hex: "#2E7D6B" },
      { name: "Sage", hex: "#A8B9A0" },
    ],
    isNew: true,
  },
  {
    id: "wine-shirt-dress",
    name: "Wine Corduroy Shirt Dress",
    images: [img("dress-burgundy"), img("dress-black")],
    price: 6900,
    mrp: 8400,
    fabric: "Baby-wale cotton corduroy",
    occasion: "Casual",
    category: "Dresses",
    sizes: ALL_SIZES,
    colors: [{ name: "Wine", hex: "#6E1F33" }],
  },
  {
    id: "blush-ruffle-set",
    name: "Blush Ruffle Organza Set",
    images: [img("blouse-blush"), img("dress-white")],
    price: 9800,
    mrp: 11900,
    fabric: "Silk organza with tiered ruffle sleeves",
    occasion: "Festive",
    category: "Dresses",
    sizes: ALL_SIZES,
    colors: [{ name: "Blush", hex: "#EBC9C0" }],
  },
];

export const productById = (id: string) => products.find((p) => p.id === id)!;

export type Look = {
  label: string;
  productId: string;
  accent: string;
};

export const showcaseLooks: Look[] = [
  { label: "Evening Gown", productId: "rosso-evening-gown", accent: "#F1E1DC" },
  { label: "Cocktail Dress", productId: "scarlet-cocktail-dress", accent: "#F6E7D2" },
  { label: "Bridal Lehenga", productId: "ivory-bridal-lehenga", accent: "#EFE9DF" },
  { label: "Summer Midi", productId: "azure-summer-midi", accent: "#E2EBEF" },
];

export const occasions = [
  { title: "Wedding & Bridal", image: img("saree-pink-bridal"), count: "86 pieces" },
  { title: "Evening", image: img("gown-plum"), count: "54 pieces" },
  { title: "Casual Day", image: img("dress-polka"), count: "120 pieces" },
  { title: "Festive Ethnic", image: img("saree-plum-silk"), count: "72 pieces" },
];

export const lookbook = [
  { image: img("saree-pink-bridal"), caption: "The Temple Bride" },
  { image: img("gown-plum"), caption: "Velvet Hour" },
  { image: img("dress-emerald"), caption: "Wild Meadow" },
  { image: img("lehenga-ivory"), caption: "Ivory Mehendi" },
  { image: img("gown-red-flow"), caption: "Rosso Promenade" },
  { image: img("saree-plum-silk"), caption: "Banaras Nights" },
  { image: img("midi-summer-blue"), caption: "Salt & Silk" },
  { image: img("dress-cocktail-red"), caption: "Garden Soirée" },
];

export const instagramFeed = [
  img("dress-polka"),
  img("saree-plum-silk"),
  img("dress-white"),
  img("gown-red-flow"),
  img("craft-zari"),
  img("dress-floral"),
  img("lehenga-ivory"),
  img("atelier-browse"),
  img("dress-emerald"),
  img("blouse-blush"),
];

export const testimonials = [
  {
    name: "Ananya R.",
    location: "Mumbai",
    avatar: img("avatar-2"),
    quote:
      "My Kanjivaram arrived wrapped like an heirloom. The zari catches light in every photo — my mother cried before I did.",
  },
  {
    name: "Meera S.",
    location: "Bengaluru",
    avatar: img("avatar-4"),
    quote:
      "The made-to-measure gown fit like it had been sculpted on me. Three alterations elsewhere never came close.",
  },
  {
    name: "Kavya N.",
    location: "Delhi",
    avatar: img("avatar-1"),
    quote:
      "Effortless, quietly luxurious, and the size guide was spot on. AURELLE is now my first stop for every occasion.",
  },
];

export const avatars = [img("avatar-1"), img("avatar-2"), img("avatar-3"), img("avatar-4")];
