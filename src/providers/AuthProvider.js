import { createContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from '@firebase/auth'
import { CircularProgress, Container, Box } from '@mui/material'
import { collection, onSnapshot } from 'firebase/firestore'

export const AuthContext = createContext({
	authUser: null,
	users: '[]'
})

const AuthProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [users, setUsers] = useState([])

	useEffect(() => {
		const chatGroupRef = collection(db, 'users')
		const unsub = onSnapshot(chatGroupRef, docs => {
			docs.forEach(doc => {
				const docData = doc.data()
				setUsers(prev => [...prev, { ...docData, groupId: doc.id }])
			})
		})
		return () => unsub()
	}, [authUser?.uid])

	const signOut = () => auth.signOut()

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				setAuthUser(user)
			} else {
				setAuthUser(null)
			}
			setIsLoading(false)
		})
	}, [])

	if (isLoading) {
		return (
			<Container>
				<Box display='flex' justifyContent='center' pt='10rem'>
					<CircularProgress />
				</Box>
			</Container>
		)
	}

	return (
		<AuthContext.Provider
			value={{
				authUser,
				signOut,
				users
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
