'use client'

import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import AdminPanelSettingsIcons from '@mui/icons-material/AdminPanelSettingsRounded'

import { styled } from '@mui/material/styles'
import { userAuth } from '@/lib/firebase/auth'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

import Updates from '@/components/Updates'
import Clues from '@/components/Clues'
import Players from '@/components/Players'
import Admin from '@/components/Admin'

const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
//   color: white;
  background: #f1f5f9;
  &.Mui-selected {
    // color: #F93D14;
  }
`)

export default function Navbar() {
	const [value, setValue] = useState(0)
	const [isAdmin, setIsAdmin] = useState('')
	const { user } = userAuth()

	useEffect(() => {
        async function getAdmin() {
            const userRef = doc(db, 'users', user?.uid as string)
            const userSnapshot = await getDoc(userRef)
            setIsAdmin(userSnapshot.data()?.isAdmin)
        }
        getAdmin()
    }, [])

	return (
		<div className="flex h-full max-w-xl flex-col items-center justify-between">
			{value === 0 && <Updates />}
			{value === 1 && <Clues />}
			{value === 2 && <Players />}
			{isAdmin && value === 3 && <Admin />}

			<Box sx={{ width: '100vw' }}>
				<BottomNavigation
					sx={{ height: '4rem', width: '100%', bgcolor: '#f1f5f9' }}
					showLabels
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue)
					}}
				>
					<BottomNavigationAction
						label="Updates"
						icon={<RestoreRoundedIcon />}
					/>
					<BottomNavigationAction
						label="Clues"
						icon={<SendRoundedIcon />}
					/>
					<BottomNavigationAction
						label="Players"
						icon={<PersonRoundedIcon />}
					/>
					{isAdmin && <BottomNavigationAction
						label="Admin"
						icon={<AdminPanelSettingsIcons />}
					/>}
				</BottomNavigation>
			</Box>
		</div>
	)
}