'use client'

import Image from 'next/image'
import firebase from 'firebase/compat/app'
import { Lobster } from 'next/font/google'
import { Roboto } from 'next/font/google'
import { userAuth } from '@/lib/firebase/auth'

interface AuthProps {
	user: firebase.User | null
	signInWithGoogle: () => Promise<void>
	signOut: () => Promise<void>
}

const lobster = Lobster({ weight: '400', subsets: ['latin'] })
const roboto = Roboto({ weight: '700', subsets: ['latin'] })

export default function Login() {
	const { user, signInWithGoogle, signOut } = userAuth() as AuthProps

	async function handleSignIn() {
		try {
			await signInWithGoogle()
		} catch (error) {
			console.error('Error signing in with Google', error)
		}
	}

    return (
        <main className='flex h-[100dvh] items-center justify-between bg-[#20242A] flex-col py-5'>
            <div className='flex flex-col items-center'>
                <Image
                    src={'/inspirit-vision.svg'}
                    alt="Inspirit Vision Logo"
                    width={100}
                    height={40}
                    priority
                />
                <h1 className={`${lobster.className} text-6xl text-white`}>Secret Santa</h1>
            </div>
            <button onClick={handleSignIn} className={`${roboto.className} bg-white rounded-full py-2 px-8 text-zinc-700 font-bold flex items-center justify-center select-none hover:bg-slate-100 active:bg-slate-100`}>
                <div className='h-full aspect-square relative'>
                    <Image
                        src={'/google-g.png'}
                        alt="Google Logo"
                        fill
                    />
                </div>
                <div className='whitespace-nowrap pl-3'>
                    Sign in with Google
                </div>
            </button>
            <div className='h-1/2 aspect-square relative'>
                <Image
                    src={'santa.png'}
                    alt="Santa Claus"
                    fill
                    priority
                />
            </div>
		</main>
    )
}
