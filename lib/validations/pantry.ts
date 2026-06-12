import { z } from "zod"



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
  expiry_date: z.string(),
  expiry_visible: z.boolean(),
})

export type AddItemFormInputValues = z.input<typeof addItemSchema>
export type AddItemFormValues = z.infer<typeof addItemSchema>
