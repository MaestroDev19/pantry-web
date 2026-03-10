import { z } from 'zod'

export const addItemSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	category: z.enum(
		[
			'Produce',
			'Dairy & Eggs',
			'Meat & Seafood',
			'Bread & Grains',
			'Pantry',
			'Frozen',
			'Snacks & Beverages',
			'Other',
		] as const,
	),
	quantity: z.number().min(1, { message: 'Quantity is required' }),
	unit: z.enum(
		[
			'kg',
			'g',
			'mg',
			'lb',
			'oz',
			'L',
			'mL',
			'gal',
			'cup',
			'tbsp',
			'tsp',
			'pieces',
			'items',
			'can',
			'bottle',
			'box',
			'bag',
			'pack',
		] as const,
	),
	expiry_date: z.string().min(1, { message: 'Expiry date is required' }),
	expiry_visible: z.boolean().optional().default(false),
})

export type AddItemFormValues = z.infer<typeof addItemSchema>
