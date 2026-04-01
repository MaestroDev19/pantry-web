import { z } from "zod"

const UNIT_ENUM = z.enum([
  "kg",
  "g",
  "mg",
  "lb",
  "oz",
  "L",
  "mL",
  "gal",
  "cup",
  "tbsp",
  "tsp",
  "pieces",
  "items",
  "can",
  "bottle",
  "box",
  "bag",
  "pack",
] as const)

export const addItemSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  category: z.enum([
    "Dairy",
    "Produce",
    "Meat & Seafood",
    "Grains & Pasta",
    "Canned Goods",
    "Frozen",
    "Snacks",
    "Beverages",
    "Condiments & Oils",
    "Baking",
    "Other",
  ] as const),
  quantity: z.number().min(1, { message: "Quantity is required" }),
  unit: z.union([UNIT_ENUM, z.undefined()]),
  expiry_date: z.string(),
  expiry_visible: z.boolean(),
})

export type AddItemFormInputValues = z.input<typeof addItemSchema>
export type AddItemFormValues = z.infer<typeof addItemSchema>
