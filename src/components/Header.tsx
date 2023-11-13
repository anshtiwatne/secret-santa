'use client'

import { userAuth } from '@/lib/firebase/auth'
import Image from 'next/image'
// import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

interface AuthProps {
	user: firebase.default.User | null
	signInWithGoogle: () => Promise<void>
	signOut: () => Promise<void>
}

export default function Header() {
	const { user, signInWithGoogle, signOut } = userAuth() as AuthProps

	async function handleSignOut() {
		try {
			await signOut()
		} catch (error) {
			console.error('Error signing out with Google', error)
		}
	}

	return (
		<div className="flex w-full items-center justify-between bg-slate-100 px-4 py-2 text-gray-800">
			<div>
				Hello, <span className="font-semibold">{user?.displayName}</span>
			</div>
			<div className="flex items-center">
				<button
					onClick={handleSignOut}
					className="rounded-full bg-slate-500 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-600"
				>
					Sign out
				</button>
				<div className="relative ml-4 h-8 w-8">
					<Image
						className="rounded-full"
						src={user?.photoURL as string}
						alt="Profile Picture"
						fill
					/>
				</div>
			</div>
		</div>
	)
}
