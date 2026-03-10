import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().email('Please enter a valid email.').trim(),
	password: z.string().min(1, { message: 'Password is required.' }),
})

export const signupSchema = z
	.object({
		name: z
			.string()
			.min(2, { message: 'Name must be at least 2 characters.' })
			.max(100, { message: 'Name must be at most 100 characters.' })
			.trim(),
		email: z.string().email('Please enter a valid email.').trim(),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters.' })
			.max(72, { message: 'Password must be at most 72 characters.' }),
		confirmPassword: z
			.string()
			.min(1, { message: 'Please confirm your password.' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
