import { doc, getDoc, setDoc } from '@firebase/firestore'
import { db } from '.'

export const addUserToDatabase = async user => {
	const userChatsDocRef = doc(db, 'userChats', user.uid)
	const userChatsDocSnapshot = await getDoc(userChatsDocRef)
	if (userChatsDocSnapshot.exists()) {
		return
	}
	await setDoc(userChatsDocRef, {})

	const userDocRef = doc(db, 'users', user.uid)
	const userDocSnapshot = await getDoc(userDocRef)
	if (userDocSnapshot.exists()) {
		return
	}
	await setDoc(userDocRef, {
		uid: user.uid,
		displayName: user.displayName,
		email: user.email,
		photoURL: user.photoURL
	})
}
