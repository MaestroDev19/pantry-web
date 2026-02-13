import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

/**
 * Root application layout.
 * Configures the global font stack and provides the top-level HTML and BODY
 * wrappers for all routes.
 */
const nunitoSans = Nunito_Sans({
	variable: '--font--nunito-sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Pantry',
	description: 'Pantry web app for managing household items',
}

interface RootLayoutProps {
	children: React.ReactNode
}

/**
 * Wraps every page in the app router.
 * Use this component to apply providers and global layout primitives.
 */
export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang="en">
			<body className={`${nunitoSans.className} antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
