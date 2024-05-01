import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	List,
	ListItem,
	ListItemText
} from '@mui/material'
import { collection, getDocs } from 'firebase/firestore'
import React, { useCallback, useState } from 'react'
import { db } from '../firebase'
import { useAuth } from '../hooks/useAuth'

function AddUserToGroup(props) {
	const { open, onClose, handle, members } = props
	const [username, setUsername] = useState('')
	const [usersList, setUsersList] = useState([])
	const [userIds, setUserIds] = useState([])
	const [err, setErr] = useState(false)
	const { authUser } = useAuth()

	const handleSearch = async () => {
		const usersCollection = collection(db, 'users')
		try {
			const querySnapshot = await getDocs(usersCollection)
			const users = []
			querySnapshot.docs.forEach(doc => {
				const foundUser =
					doc
						.data()
						.displayName.toLowerCase()
						.includes(username.toLowerCase()) &&
					authUser?.uid !== doc.data().uid &&
					!members.some(member => member === doc.data().uid)
				if (foundUser) {
					users.push(doc.data())
				}
			})
			setUsersList(users)
			if (querySnapshot.empty) {
				console.log('No documents found matching the query.')
			}
		} catch (err) {
			console.error('Error fetching users:', err)
			setErr(true)
		}
	}

	const someUserId = useCallback(
		uid => {
			return userIds.some(id => id === uid)
		},
		[userIds]
	)

	const toggle = uid => {
		setUserIds(prevUserIds => {
			if (prevUserIds.includes(uid)) {
				return prevUserIds.filter(id => id !== uid)
			} else {
				return [...prevUserIds, uid]
			}
		})
	}

	async function handleAddUser() {
		await handle(userIds)
		setUsername('')
		setUserIds([])
		setUsersList([])
		setErr(false)
	}

	return (
		<Dialog open={open} onClose={() => onClose(false)}>
			<DialogTitle>Добавить пользователя в группу</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Введите имя пользователя, которого вы хотите добавить в эту группу.
				</DialogContentText>
				<TextField
					autoFocus
					margin='dense'
					id='username'
					label='Имя ползователя'
					type='text'
					fullWidth
					value={username}
					onKeyDown={async e => {
						if (e.key === 'Enter') {
							await handleSearch()
						}
					}}
					onChange={e => setUsername(e.target.value)}
				/>
				<List>
					{usersList.map((user, index) => (
						<ListItem
							key={index}
							sx={{
								backgroundColor: '#f0f0f0',
								'&:hover': {
									backgroundColor: someUserId(user.uid) ? '' : '#e0e0e0'
								},
								borderRadius: '4px',
								marginBottom: '4px',
								display: 'flex',
								alignItems: 'center',
								px: 1
							}}
						>
							<Checkbox
								checked={someUserId(user.uid)}
								onChange={() => toggle(user.uid)}
							/>
							<ListItemText primary={user.displayName} />
						</ListItem>
					))}
				</List>
				{err && 'Пользователь не найден'}
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onClose(false)} color='primary'>
					Отмена
				</Button>
				<Button onClick={handleAddUser} color='primary'>
					Добавить
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default AddUserToGroup
