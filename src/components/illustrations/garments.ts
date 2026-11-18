import type { GarmentKind } from "../../data/products";

/**
 * Контуры одежды для иллюстраций. Система координат 200×260,
 * плечики вешалки — на уровне y≈70, крючок — в точке (100, 10).
 */
export interface GarmentShape {
  /** Силуэт изделия (заливка цветом тона) */
  body: string;
  /** Детали: швы, карманы, манжеты (тонкая обводка) */
  details: string;
  /** Пуговицы/заклёпки: [x, y] */
  dots?: [number, number][];
}

export const hangerPath = "M100 52 V44 C100 37 110 35 110 24 A10 10 0 0 0 90 24 M100 52 L36 78 H164 Z";

export const garments: Record<GarmentKind, GarmentShape> = {
  tshirt: {
    body: "M72 66 L40 82 L20 118 L48 132 L60 110 L60 222 Q100 230 140 222 L140 110 L152 132 L180 118 L160 82 L128 66 Q100 90 72 66 Z",
    details: "M48 132 L56 116 M152 132 L144 116 M84 72 Q100 84 116 72 M60 206 Q100 214 140 206",
  },
  sweater: {
    body: "M72 66 L44 80 Q28 130 26 204 L50 208 Q56 156 62 120 L62 224 Q100 232 138 224 L138 120 Q144 156 150 208 L174 204 Q172 130 156 80 L128 66 Q100 88 72 66 Z",
    details:
      "M26 194 L50 198 M150 198 L174 194 M62 210 Q100 218 138 210 M70 214 V222 M86 216 V226 M100 217 V228 M114 216 V226 M130 214 V222 M82 70 Q100 82 118 70 M78 120 L92 136 L78 152 M122 120 L108 136 L122 152",
  },
  coat: {
    body: "M74 64 L46 78 Q32 140 28 236 L54 238 L60 132 L58 246 H142 L140 132 L146 238 L172 236 Q168 140 154 78 L126 64 L100 112 Z",
    details: "M74 64 L86 104 L100 112 M126 64 L114 104 L100 112 M100 112 V246 M66 176 H86 M114 176 H134 M28 226 L54 228 M146 228 L172 226",
    dots: [
      [108, 136],
      [108, 166],
      [108, 196],
    ],
  },
  dress: {
    body: "M82 66 L74 100 Q82 112 76 132 L40 236 Q100 254 160 236 L124 132 Q118 112 126 100 L118 66 Q100 84 82 66 Z",
    details: "M76 132 Q100 142 124 132 M62 190 Q100 204 138 190 M86 70 L90 98 M114 70 L110 98",
  },
  jeans: {
    body: "M60 74 H140 L150 238 H110 L100 124 L90 238 H50 Z",
    details: "M60 88 H140 M100 88 V124 M70 88 Q72 108 88 110 M130 88 Q128 108 112 110 M54 220 H88 M112 220 H146",
    dots: [[100, 81]],
  },
  jacket: {
    body: "M74 64 L44 78 Q32 122 30 182 L54 186 L60 122 L60 198 H140 L140 122 L146 186 L170 182 Q168 122 156 78 L126 64 L100 96 Z",
    details: "M74 64 L84 90 L100 96 M126 64 L116 90 L100 96 M100 96 V198 M70 130 H90 V150 H70 Z M110 130 H130 V150 H110 Z M60 186 H140",
    dots: [
      [106, 112],
      [106, 138],
      [106, 164],
    ],
  },
};

export const toneColors = {
  blue: { fill: "var(--color-blue-600)", line: "var(--color-blue-100)" },
  navy: { fill: "var(--color-navy-900)", line: "var(--color-blue-400)" },
  coral: { fill: "var(--color-coral-500)", line: "var(--color-cream-50)" },
  sky: { fill: "var(--color-blue-400)", line: "var(--color-navy-900)" },
} as const;

export type Tone = keyof typeof toneColors;
