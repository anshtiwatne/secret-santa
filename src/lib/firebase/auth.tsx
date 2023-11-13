'use client'

import { useContext, createContext, useEffect, useState } from 'react'
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { auth } from './config'

type User = firebase.User | null
type ContextState = { user: User, signInWithGoogle: () => void, signOut: () => void }

const AuthContext = createContext<ContextState | undefined>(undefined)

export function AuthContextProvider({ children }:{ children: React.ReactNode}) {
	const [user, setUser] = useState<User>(null)

	function signInWithGoogle() {
		const provider = new GoogleAuthProvider()
		signInWithPopup(auth, provider)
	}

	function signOut() {
		auth.signOut()
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser as User)
		})
		return () => unsubscribe()
	}, [user])

	return (
		<AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
			{ children }
		</AuthContext.Provider>
	)
}

export function userAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthContextProvider')
	}
	return context
}
