'use client'

import Image from 'next/image'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/config'
import { userAuth } from '@/lib/firebase/auth'
// import EastIcon from '@mui/icons-material/EastRounded'

interface playerData {
	name: string
	username: string
	uid: string
	photoURL: string
	cluesGiven: string[]
	santaGuesses: string[]
	giftee: string
	giftor: string
	isAdmin: boolean
}

export default function Admin() {
	const { user } = userAuth()
	const [players, setPlayers] = useState<playerData[]>([])

	useEffect(() => {
		async function getPlayers() {
			const usersRef = collection(db, 'users')
			const usersSnapshot = await getDocs(usersRef)
			let playersList = []
			for (let userDoc in usersSnapshot.docs) {
				const player = usersSnapshot.docs[userDoc].data()
				playersList.push(player)
			}
			setPlayers(playersList as playerData[])
		}
		getPlayers()
	}, [])

	return (
		<div className='scroll no-scrollbar flex w-full flex-grow flex-col overflow-x-visible overflow-y-scroll h-1 my-2'>
		<div className='flex flex-grow flex-col w-full items-center'>
			<div className='mt-2 font-semibold text-lg text-gray-700'>Clues not given</div>
			<ol className="scroll no-scrollbar flex w-full flex-grow flex-col overflow-x-hidden overflow-y-scroll py-2 pl-2 pr-4">
				{players.map((player, i) =>
					player.cluesGiven.length <= 0 ? (
						<li
							key={i}
							className="my-1 ml-1 flex w-full items-center justify-between rounded-lg bg-slate-100 player-shadow py-2 pl-3 pr-4"
						>
							<div className="flex flex-grow items-center justify-between">
								<div className="flex items-center">
									<div className="relative mr-2 h-8 w-8">
										<Image
											className="rounded-full"
											src={player.photoURL as string}
											alt="Profile Picture"
											fill
										/>
									</div>
									<span>{player.username}</span>
								</div>
							</div>
						</li>
					) : (
						<div></div>
					),
				)}
			</ol>
		</div>
		<div className='flex flex-grow flex-col w-full items-center'>
		<div className='mt-2 font-semibold text-gray-700 text-lg'>Guesses not made</div>
		<ol className="scroll no-scrollbar flex w-full flex-grow flex-col overflow-x-hidden overflow-y-scroll py-2 pl-2 pr-4">
			{players.map((player, i) =>
				player.cluesGiven.length <= 0 ? (
					<li
						key={i}
						className="my-1 ml-1 flex w-full items-center justify-between rounded-lg bg-slate-100 player-shadow py-2 pl-3 pr-4"
					>
						<div className="flex flex-grow items-center justify-between">
							<div className="flex items-center">
								<div className="relative mr-2 h-8 w-8">
									<Image
										className="rounded-full"
										src={player.photoURL as string}
										alt="Profile Picture"
										fill
									/>
								</div>
								<span>{player.username}</span>
							</div>
						</div>
					</li>
				) : (
					<div></div>
				),
			)}
		</ol>
	</div>
	</div>
	)
}
