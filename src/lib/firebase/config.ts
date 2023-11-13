'use client'

import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: 'AIzaSyAsPNSRUkWuw6TpO9lkUQhNNSRvu1kRMpM',
	authDomain: 'iv-secret-santa.firebaseapp.com',
	projectId: 'iv-secret-santa',
	storageBucket: 'iv-secret-santa.appspot.com',
	messagingSenderId: '988779075861',
	appId: '1:988779075861:web:c0ae42bed683c22116711c',
	measurementId: 'G-JYMDYYTQVS',
}

const app = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(app)
export const db = getFirestore(app)
export const auth = getAuth(app)
