'use client'

import { db } from '@/lib/firebase/config'
import { collection, getDoc, doc } from "firebase/firestore"
import { useState, useEffect } from 'react'

type Clues = {
	[key: string]: {
		for: string
		clue: string
	}
}

type Guesses = {
	[key: string]: {
		by: string
		guess: string
		guessCorrect: boolean
	}
}

export default function Updates() {

	const [clues, setClues] = useState({} as Clues)
	const [guesses, setGuesses] = useState({} as Guesses)

    useEffect(() => {
        async function getClues() {
            const cluesRef = doc(db, 'data', 'clues')
            const cluesSnapshot = await getDoc(cluesRef)
            const cluesList = cluesSnapshot.data()
            setClues(cluesList as Clues)
        }
        getClues()
    }, [])

	useEffect(() => {
        async function getGuesses() {
            const guessesRef = doc(db, 'data', 'guesses')
            const guessesSnapshot = await getDoc(guessesRef)
            const guessesList = guessesSnapshot.data()
            setGuesses(guessesList as Guesses)
        }
        getGuesses()
    }, [])

	let clueKeys = Object.keys(clues).sort().reverse()
	if (clueKeys.length > 5) {
		clueKeys = clueKeys.slice(0, 4)
	}

	let guessKeys = Object.keys(guesses).sort().reverse()
	if (guessKeys.length > 5) {
		guessKeys = guessKeys.slice(0, 4)
	}

	return (
        // placeholder data
		<div className="flex w-full flex-grow flex-col justify-between px-4 h-1 pb-4">
			<div className="flex h-1/2 flex-col">
				<div className="pt-4 pb-1 text-lg font-semibold text-gray-700">Latest Clues</div>
				<ul className="flex-grow rounded-lg shadow bg-slate-100 text-gray-800 px-4 py-2 overflow-y-scroll">
					{clueKeys.map((key, i) => (
						<li key={i} className="my-2">
							<div className='font-semibold text-sm text-gray-700'>for {clues[key].for}:</div>
							<div>{clues[key].clue}</div>
						</li>
					))}
				</ul>
			</div>
			<div className="flex h-1/2 flex-col">
				<div className="pt-4 pb-1 text-lg font-semibold text-gray-700">Latest Guesses</div>
				<ul className="flex-grow rounded-lg shadow bg-slate-100 px-4 py-2 overflow-y-scroll">
					{guessKeys.map((key, i) => (
						<li key={i} className="my-2 text-gray-800">
							{guesses[key].guessCorrect ? (
								<div><span className='font-semibold text-gray-700'>{guesses[key].by}</span> found their Santa <span className='font-semibold text-gray-700'>{guesses[key].guess}</span></div>
							) : (
								<div><span className='font-semibold text-gray-700'>{guesses[key].by}</span> guessed <span className='font-semibold text-gray-700'>{guesses[key].guess}</span> as their Santa</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
