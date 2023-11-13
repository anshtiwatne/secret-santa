'use client'

import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { userAuth } from '@/lib/firebase/auth'

type userData = {
	username: string
	uid: string
	photoURL: string
	giftee: string
	giftor: string
	santaGuesses: string[]
	santaFound: boolean
	cluesGiven: string[]
}

export default function Clues() {
	const { user } = userAuth()
	const [cluesReceived, setCluesReceived] = useState([])
	const [cluesGiven, setCluesGiven] = useState([])

	const [guessValue, setGuessValue] = useState('')
	const [clueValue, setClueValue] = useState('')

	const [santaUsername, setSantaUsername] = useState('')
	const [playerUsername, setPlayerUsername] = useState('')
	const [gifteeUsername, setGifteeUsername] = useState('')
	const playerRef = doc(db, 'users', user?.uid as string)

	useEffect(() => {
		async function getPlayer() {
			const playerSnapshot = await getDoc(playerRef)
			const playerData = playerSnapshot.data()
			const cluesGiven = playerData?.cluesGiven

			setCluesGiven(cluesGiven)

			const santa = playerData?.giftor
			if (santa) {
				const santaRef = doc(db, 'users', santa)
				const santaSnapshot = await getDoc(santaRef)
				const santaData = santaSnapshot.data()
				const clues = santaData?.cluesGiven

				setSantaUsername(santaData?.username)
				setCluesReceived(clues)
			}

			const giftee = playerData?.giftee
			if (giftee) {
				const gifteeRef = doc(db, 'users', giftee)
				const gifteeSnapshot = await getDoc(gifteeRef)
				const gifteeData = gifteeSnapshot.data()
				setGifteeUsername(gifteeData?.username)
				setPlayerUsername(playerData?.username)
			}
		}
		getPlayer()
	}, [])

	function handleGuessSubmit() {
		if (guessValue.replace(' ', '') != '') {
			const epoch = Date.now()
			if (guessValue === santaUsername) {
				alert('You found your santa!')
				setDoc(playerRef, { santaFound: true }, { merge: true })
				setDoc(
					doc(db, 'data', 'guesses'),
					{
						[epoch]: {
							guess: guessValue,
							by: playerUsername,
							guessCorrect: true,
						},
					},
					{ merge: true },
				)
			} else {
				alert('Wrong guess')
				setDoc(
					doc(db, 'data', 'guesses'),
					{
						[epoch]: {
							guess: guessValue,
							by: playerUsername,
							guessCorrect: false,
						},
					},
					{ merge: true },
				)
			}
		}
	}

	function handleClueSubmit() {	
		if (clueValue.replace(' ', '') != '') {
			const epoch = Date.now()
			setCluesGiven(cluesGiven.concat([clueValue] as any))
			setDoc(
				playerRef,
				{ cluesGiven: cluesGiven.concat([clueValue] as any) },
				{ merge: true },
			)
			setDoc(
				doc(db, 'data', 'clues'),
				{ [epoch]: { clue: clueValue, for: gifteeUsername } },
				{ merge: true },
			)
			setClueValue('')
		}
		
	}

	const [myGuesses, setMyGuesses] = useState([])
	const [gifteeGuesses, setGifteeGuesses] = useState([])

	useEffect(() => {
		async function getMyGuesses() {
			const playerSnapshot = await getDoc(playerRef)
			const playerData = playerSnapshot.data()

			const gifteeRef = doc(db, 'users', playerData?.giftee)
			const santaSnapshot = await getDoc(gifteeRef)
			const gifteeData = santaSnapshot.data()

			const guessesRef = doc(db, 'data', 'guesses')
			const guessesSnapshot = await getDoc(guessesRef)
			const guessesData = guessesSnapshot.data()
			const myGuessesTemp = []
			const gifteeGuessesTemp = []
			for (let guess in guessesData) {
				if (guessesData[guess].by === playerData?.username) {
					myGuessesTemp.push(guessesData[guess].guess)
				}
				if (guessesData[guess].by === gifteeData?.username) {
					gifteeGuessesTemp.push(guessesData[guess].guess)
				}
			}
			setMyGuesses(myGuessesTemp as any)
			setGifteeGuesses(gifteeGuessesTemp as any)
		}
		getMyGuesses()
	}, [])

	const [viewMyGuesses, setViewMyGuesses] = useState(false)
	const [viewGifteeGuesses, setViewGifteeGuesses] = useState(false)

	return (
		// placeholder data
		<div className="flex w-full flex-grow flex-col justify-between px-4 pb-6">
			<div className="flex h-1/2 flex-col">
				<div className="flex items-center justify-between pb-2 pt-4">
					<div className="text-lg font-semibold text-gray-700">Clues received</div>
					<button
						onClick={() => setViewMyGuesses(!viewMyGuesses)}
						className={`rounded-full bg-slate-100 text-gray-700 font-semibold px-2 py-1 text-sm ${viewMyGuesses ? 'bg-slate-200' : ''}`}
					>
						View Guesses
					</button>
				</div>
				{!viewMyGuesses ? (
					<div className="flex flex-grow flex-col rounded-lg shadow bg-slate-100 text-gray-800">
						<ul className="flex-grow px-4 py-2">
							{cluesReceived.map((clue, i) => (
								<li className="py-1" key={i}>
									<span className="pr-2 font-mono font-semibold text-gray-600">
										{i + 1}.
									</span>
									{clue}
								</li>
							))}
						</ul>
						<div className="flex w-full">
							<div className="flex-grow">
								<input
									onChange={(e) => {
										setGuessValue(e.currentTarget.value)
									}}
									value={guessValue}
									placeholder="Guess your santa"
									className="w-full rounded-l-lg bg-slate-200 px-4 py-2 outline-none"
									type="text"
								/>
							</div>
							<button
								onClick={handleGuessSubmit}
								className="rounded-r-lg text-white bg-slate-500 px-4 py-2 font-medium hover:bg-slate-600"
							>
								Submit
							</button>
						</div>
					</div>
				) : (
					<div className="flex flex-grow shadow flex-col rounded-lg bg-slate-100 text-gray-800">
						<ul className="flex-grow px-4 py-2">
							{myGuesses.map((guess, i) => (
								<li className="py-1" key={i}>
									<span className="pr-2 font-mono font-semibold text-gray-600">
										{i + 1}.
									</span>
									{guess}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			<div className="flex h-1/2 flex-col">
				<div className="flex items-center justify-between pb-2 pt-4">
					<div className="text-lg text-gray-700 font-semibold">Clues given</div>
					<button onClick={() => setViewGifteeGuesses(!viewGifteeGuesses)} className={`rounded-full bg-slate-100 text-gray-700 font-semibold px-2 py-1 text-sm ${viewGifteeGuesses ? 'bg-slate-200' : ''}`}>
						View guesses
					</button>
				</div>
				{!viewGifteeGuesses ? (
					<div className="flex flex-grow shadow flex-col rounded-lg bg-slate-100">
						<ul className="flex-grow px-4 py-2">
							{cluesGiven.map((clue, i) => (
								<li className="py-1" key={i}>
									<span className="pr-2 font-mono font-semibold text-gray-600">
										{i + 1}.
									</span>
									{clue}
								</li>
							))}
						</ul>

						{cluesGiven.length < 3 ? (
							<div className="flex w-full">
								<div className="flex-grow">
									<input
										onChange={(e) => {
											setClueValue(e.currentTarget.value)
										}}
										value={clueValue}
										placeholder="Give a clue"
										className="w-full rounded-l-lg bg-slate-200 px-4 py-2 outline-none"
										type="text"
									/>
								</div>
								<button
									onClick={handleClueSubmit}
									className="rounded-r-lg text-white bg-slate-500 px-4 py-2 font-medium hover:bg-slate-600"
								>
									Submit
								</button>
							</div>
						) : (
							<div className="flex w-full">
								<div className="flex-grow">
									<input
										disabled
										value={''}
										placeholder="Can't give more than 3 clues"
										className="w-full rounded-l bg-slate-200 px-4 py-2 outline-none hover:cursor-not-allowed"
										type="text"
									/>
								</div>
								<button
									disabled
									className="rounded-r bg-slate-500 text-white px-4 py-2 hover:cursor-not-allowed"
								>
									Submit
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="flex shadow flex-grow flex-col rounded-lg bg-slate-100 text-gray-800">
						<ul className="flex-grow px-4 py-2">
							{gifteeGuesses.map((guess, i) => (
								<li className="py-1" key={i}>
									<span className="pr-2 font-mono font-semibold text-gray-600">
										{i + 1}.
									</span>
									{guess}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}
