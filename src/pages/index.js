import { useEffect, useState } from 'react'
import { Container, Typography, Button, Box, Dialog } from '@mui/material'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { auth } from '../firebase'
import { addUserToDatabase } from '../firebase/firestore'

// Configure FirebaseUI.
const uiConfig = {
	signInFlow: 'popup',
	signInSuccessUrl: '/dashboard',
	signInOptions: [
		firebase.auth.EmailAuthProvider.PROVIDER_ID,
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.PhoneAuthProvider.PROVIDER_ID
	],
	callbacks: {
		signInSuccessWithAuthResult: () => true
	}
}

const Index = () => {
	const UI =
		firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
	const [login, setLogin] = useState(false)

	const onAuthenticate = () => {
		setLogin(true)
		setTimeout(() => {
			UI.start('#firebaseui-auth-container', uiConfig)
		})
	}

	return (
		<Container>
			<Box padding='5rem'>
				<Typography variant='h3'>Welcome to Simple Chat App!</Typography>
				<Typography mt={1} mb={1} variant='subtitle2'>
					You can join our chat with random users.
				</Typography>
				<Button onClick={onAuthenticate} variant='contained'>
					LOGIN / REGISTER
				</Button>
				<Dialog open={login} onClose={() => setLogin(false)}>
					<div id='firebaseui-auth-container' />
				</Dialog>
			</Box>
		</Container>
	)
}

export default Index
