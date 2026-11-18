export type GarmentKind = "coat" | "sweater" | "dress" | "tshirt" | "jeans" | "jacket";

export interface Product {
  id: string;
  name: string;
  kind: GarmentKind;
  price: number;
  oldPrice?: number;
  badge?: "New" | "Sale" | "Хит";
  /** Цвет изделия на иллюстрации (токен палитры) */
  tone: "blue" | "navy" | "coral" | "sky";
}

export const products: Product[] = [
  { id: "coat-01", name: "Пальто оверсайз «Бриз»", kind: "coat", price: 14990, badge: "New", tone: "navy" },
  { id: "sweater-01", name: "Свитер из мериноса", kind: "sweater", price: 6490, badge: "Хит", tone: "coral" },
  { id: "dress-01", name: "Платье-рубашка «Волна»", kind: "dress", price: 7990, tone: "blue" },
  {
    id: "jacket-01",
    name: "Джинсовая куртка",
    kind: "jacket",
    price: 8990,
    oldPrice: 11490,
    badge: "Sale",
    tone: "sky",
  },
  { id: "tshirt-01", name: "Футболка из хлопка", kind: "tshirt", price: 1990, tone: "coral" },
  { id: "jeans-01", name: "Прямые джинсы", kind: "jeans", price: 5490, badge: "New", tone: "blue" },
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);
