import React from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { makeStyles } from '@mui/styles'
import { InputBase } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
const useStyles = makeStyles({
	searchForm: {
		position: 'relative',
		borderRadius: 4,
		backgroundColor: '#f0f2f5',
		'&:hover': {
			backgroundColor: '#e0e2e5'
		},
		marginRight: 3,
		marginLeft: 0,
		marginTop: 10,
		width: '100%'
	},
	inputRoot: {
		color: 'inherit'
	},
	inputInput: {
		padding: '8px 8px 8px 14px',
		transition: 'width 300ms',
		width: '100%'
	}
})

function UserSearch({ setFound, setErr, setName, name, clear }) {
	const classes = useStyles()

	const { authUser } = useAuth()

	const handleSearch = async () => {
		const usersCollection = collection(db, 'users')
		let founds = []
		try {
			const querySnapshot = await getDocs(usersCollection)

			querySnapshot.docs.forEach(doc => {
				const findUser =
					doc.data().displayName.toLowerCase().includes(name.toLowerCase()) &&
					authUser?.uid !== doc.data().uid
				if (findUser) {
					founds.push(doc.data())
				}
			})
			if (querySnapshot.empty) {
				console.log('No documents found matching the query.')
			}
			setFound(founds)
		} catch (err) {
			console.error('Error fetching users:', err)
			setErr(true)
		}
	}

	const handleKey = e => {
		e.code === 'Enter' && handleSearch()
	}
	return (
		<div className={classes.searchForm}>
			<InputBase
				placeholder='Find a user | group'
				onKeyDown={handleKey}
				onChange={e => setName(e.target.value)}
				value={name}
				classes={{
					root: classes.inputRoot,
					input: classes.inputInput
				}}
			/>
		</div>
	)
}

export default UserSearch
