import { createContext, useEffect, useRef, useState } from 'react'
import { useChats } from '../hooks/useChats'
import {
	doc,
	onSnapshot,
	arrayUnion,
	serverTimestamp,
	Timestamp,
	updateDoc,
	collection,
	getDocs
} from '@firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { db, storage } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import { useChatGroup } from '../hooks/useChatGroup'

export const MessagesContext = createContext()

const MessagesProvider = ({ children }) => {
	const [messages, setMessages] = useState([])
	const messagesEndRef = useRef(null)

	const { chatId, user } = useChats()
	const { groupId, getGroups } = useChatGroup()

	const { authUser } = useAuth()

	useEffect(() => {
		const Id = chatId !== 'null' ? chatId : groupId
		const unSub = onSnapshot(doc(db, 'chats', Id), doc => {
			if (doc.exists() && doc.data().messages) {
				setMessages(doc.data().messages)
			} else {
				setMessages([])
			}
		})
		return () => unSub()
	}, [chatId, groupId])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const uuid = () => Date.now().toString()

	const handleSend = async (text, img) => {
		const Id = chatId !== 'null' ? chatId : groupId
		try {
			if (!Id) {
				console.error('Error: chatId or groupId is not defined.')
				return
			}
			if (img) {
				const storageRef = ref(storage, uuid())
				const uploadTask = uploadBytesResumable(storageRef, img)

				await uploadTask

				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

				await updateDoc(doc(db, 'chats', Id), {
					messages: arrayUnion({
						id: uuid(),
						text,
						senderId: authUser.uid,
						date: Timestamp.now(),
						img: downloadURL,
						photoURL: authUser.photoURL
					})
				})
			} else {
				await updateDoc(doc(db, 'chats', Id), {
					messages: arrayUnion({
						id: uuid(),
						text,
						senderId: authUser.uid,
						date: Timestamp.now(),
						photoURL: authUser.photoURL
					})
				})
			}

			if (groupId !== 'null') {
				await updateDoc(doc(db, 'chatGroups', groupId), {
					lastMessage: {
						text,
						img: img && 'true'
					},
					date: serverTimestamp()
				})
				await getGroups()
			}

			if (chatId !== 'null') {
				await updateDoc(doc(db, 'userChats', authUser.uid), {
					[chatId + '.lastMessage']: {
						text,
						img: img && 'true'
					},
					[chatId + '.date']: serverTimestamp()
				})

				await updateDoc(doc(db, 'userChats', user.uid), {
					[chatId + '.lastMessage']: {
						text,
						img: img && 'true'
					},
					[chatId + '.date']: serverTimestamp()
				})
			}
		} catch (error) {
			console.error('Error during message sending:', error)
		}
	}

	async function findUserToSenderId(senderId) {
		const groupQuerySnapshot = await getDocs(collection(db, 'users'))
		let findUser = {}
		groupQuerySnapshot.docs.forEach(doc => {
			const user = doc.data()
			if (user.uid === senderId) {
				findUser = user
			}
		})

		return findUser
	}

	const values = {
		messages,
		messagesEndRef,
		handleSend,
		findUserToSenderId
	}

	return (
		<MessagesContext.Provider value={values}>
			{children}
		</MessagesContext.Provider>
	)
}

export default MessagesProvider
