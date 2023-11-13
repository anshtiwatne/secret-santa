import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { AuthContextProvider } from '@/lib/firebase/auth'
import './globals.css'

const poppins = Poppins({ weight:['400', '600', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Secret Santa',
	description: 'Inspirit Vision Secret Santa',
	manifest: '/manifest.webmanifest',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={poppins.className}>
				<AuthContextProvider>{children}</AuthContextProvider>
			</body>
		</html>
	)
}
