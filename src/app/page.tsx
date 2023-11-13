'use client'

import { useState, useEffect } from 'react'
import { userAuth } from '@/lib/firebase/auth'
import { db } from '@/lib/firebase/config'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import Login from '@/components/Login'
import Header from '@/components/Header'
import NavBar from '@/components/NavBar'

export default function Home() {
	const { user } = userAuth()
	const [loading, setLoading] = useState(true)

	
	useEffect(() => {
		async function initUser() {
			if (user) {
				const usersRef = collection(db, 'users')
				const userRef = doc(usersRef, user?.uid)
				getDoc(userRef).then((doc) => {
					if (doc.exists()) {
					} else {
						setDoc(userRef, {
							name: user.displayName,
							username: user.email?.split('@')[0].replace('.', ''),
							uid: user.uid,
							photoURL: user.photoURL,
							giftee: null,
							giftor: null,
							santaGuesses: [],
							santaFound: false,
							cluesGiven: [],
							isAdmin: false,
						})
					}
				})
			}
		}
		initUser()
	}, [user])

	useEffect(() => {
		async function checkAuth() {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			setLoading(false)
		}

		checkAuth()
	})

	return (
		loading ? (
			<main className="flex h-[100dvh] items-center justify-center">
				<span className="loader" />
			</main>
		) : (
			user ? (
				<main className="flex h-[100dvh] flex-col items-center justify-center text-gray-800">
					<Header />
					<NavBar />
				</main>
			) : (
				<Login />
			)
		)
	)
}
