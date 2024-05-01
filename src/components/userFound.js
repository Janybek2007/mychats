import { Avatar, ListItem, ListItemText } from '@mui/material'
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc
} from 'firebase/firestore'
import React from 'react'
import { db } from '../firebase'
import { useAuth } from '../hooks/useAuth'
function UserFound({ found, clear }) {
	const { authUser } = useAuth()

	const founds = found.filter(found => !found.groupName)

	async function handleGroupSelect(find) {
		try {
			const res = await getDoc(doc(db, 'chats', find.groupId))

			if (!res.exists()) {
				await setDoc(doc(db, 'chats', find.groupId), { messages: [] })
			}
		} catch (error) {}
	}

	const handleSelect = async find => {
		const combinedId =
			authUser?.uid > find.uid
				? authUser?.uid + find.uid
				: find.uid + authUser?.uid
		try {
			if (!find.uid) {
				await handleGroupSelect({ group: find })
				return
			}
			const res = await getDoc(doc(db, 'chats', combinedId))

			if (!res.exists()) {
				await setDoc(doc(db, 'chats', combinedId), {
					messages: []
				})

				await updateDoc(doc(db, 'userChats', authUser?.uid), {
					[combinedId + '.userInfo']: {
						uid: find.uid,
						displayName: find.displayName,
						photoURL: find.photoURL
					},
					[combinedId + '.date']: serverTimestamp()
				})

				await updateDoc(doc(db, 'userChats', find.uid), {
					[combinedId + '.userInfo']: {
						uid: authUser?.uid,
						displayName: authUser?.displayName,
						photoURL: authUser.photoURL
					},
					[combinedId + '.date']: serverTimestamp()
				})
			}
		} catch (err) {}

		clear()
	}

	return (
		founds &&
		founds.map((item, idx) => {
			return (
				<ListItem
					ke={idx}
					sx={{
						mt: 2,
						cursor: 'pointer'
					}}
					onClick={async () => handleSelect(item)}
				>
					<Avatar sx={{ mr: 1 }} src={item.photoURL} alt='img' />
					<ListItemText primary={item.displayName} />
				</ListItem>
			)
		})
	)
}

export default UserFound
