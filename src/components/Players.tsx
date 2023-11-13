'use client'

import Image from 'next/image'
import { collection, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/config'
import SearchIcon from '@mui/icons-material/SearchRounded'

type userData = {
	username: string
	uid: string
	photoURL: string
	giftee: string
	giftor: string
	santaGuesses: string[]
	santaFound: boolean
	cluesGiven: string[]
	isAdmin: boolean
}

export default function Players() {
	const [players, setPlayers] = useState([] as userData[])
	const [filteredPlayers, setFilteredPlayers] = useState([] as userData[])
	const [search, setSearch] = useState('')

	useEffect(() => {
		async function getPlayers() {
			const usersRef = collection(db, 'users')
			const usersSnapshot = await getDocs(usersRef)
			const usersList = usersSnapshot.docs.map((doc) => doc.data())
			setPlayers(usersList as any)
		}
		getPlayers()
	}, [])

	useEffect(() => {
		async function searchPlayers() {
			setFilteredPlayers(
				players.filter((player) =>
					player.username.toLowerCase().includes(search.toLowerCase()),
				),
			)
		}
		searchPlayers()
	}, [search])

	return (
		<div className="flex w-full flex-grow flex-col">
			<div className="m-3 mt-5 flex rounded-lg bg-gray-100 player-shadow p-2">
				<SearchIcon />
				<input
					onChange={(e) => setSearch(e.currentTarget.value)}
					className="w-full bg-gray-100 px-2 outline-none"
					type="text"
					placeholder='search'
				/>
			</div>
			<div className='px-4'>
				<hr />
			</div>
			<ol className="scroll no-scrollbar flex h-1 w-full flex-grow flex-col overflow-x-hidden overflow-y-scroll py-2 pl-2 pr-4">
				{search
					? filteredPlayers.map((player, i) => (
							<li
								key={i}
								className="my-1 ml-1 flex w-full items-center player-shadow justify-between rounded-lg bg-slate-100 py-2 pl-3 pr-4"
							>
								<div className="flex items-center">
									<div className="relative mr-2 h-8 w-8">
										<Image
											className="rounded-full"
											src={player?.photoURL as string}
											alt="Profile Picture"
											fill
										/>
									</div>
									{player.username}
								</div>
								<div className="font-semibold text-gray-500">
									{player.santaFound ? 'santa found' : ''}
								</div>
							</li>
					  ))
					: players.map((player, i) => (
							<li
								key={i}
								className="my-1 ml-1 flex w-full items-center justify-between rounded-lg bg-slate-100 player-shadow py-2 pl-3 pr-4"
							>
								<div className="flex items-center">
									<div className="relative mr-2 h-8 w-8">
										<Image
											className="rounded-full"
											src={player?.photoURL as string}
											alt="Profile Picture"
											fill
										/>
									</div>
									{player.username}
								</div>
								<div className="font-semibold text-gray-500">
									{player.santaFound ? 'santa found' : ''}
								</div>
							</li>
					  ))}
			</ol>
		</div>
	)
}
