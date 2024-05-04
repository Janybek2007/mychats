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
	getDocs,
	getDoc,
	setDoc
} from '@firebase/firestore'
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable
} from 'firebase/storage'

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

	async function deleteMessage(messageId, is) {
		if (chatId === 'null' && groupId === 'null') return
		const roomId = chatId === 'null' ? groupId : chatId
		try {
			const chatsDocRef = doc(db, 'chats', roomId)
			const chatDoc = await getDoc(chatsDocRef)

			if (chatDoc.exists()) {
				const currentMessages = chatDoc.data().messages
				const updatedMessages = currentMessages
					.map(message => {
						if (message.id === messageId) {
							if (message.img && is !== 'img') {
								return { ...message, text: '' }
							} else {
								return null
							}
						}
						return message
					})
					.filter(Boolean)

				await updateDoc(chatsDocRef, { messages: updatedMessages })

				await notify('deleted')

				if (is === 'img') {
					const deletedMessage = currentMessages.find(
						message => message.id === messageId
					)
					if (deletedMessage && deletedMessage.img) {
						const imgRef = ref(storage, deletedMessage.img)
						await deleteObject(imgRef)
					}
				}
			} else {
				console.error('Chat document does not exist')
			}
		} catch (error) {
			console.error('Error deleting message:', error)
		}
	}

	async function updateTextMessage(messageId, editText) {
		if (chatId === 'null' && groupId === 'null') return
		const roomId = chatId === 'null' ? groupId : chatId

		const chatsDoc = doc(db, 'chats', roomId)
		const chatDoc = await getDoc(chatsDoc)

		if (chatDoc.exists()) {
			const messages = chatDoc.data().messages
			const updatedMessages = messages.map(message => {
				if (message.id === messageId) {
					return { ...message, text: editText }
				}
				return message
			})

			await setDoc(chatsDoc, { messages: updatedMessages }, { merge: true })

			await notify('updated')
		}
	}

	async function notify(text) {
		if (chatId !== 'null') {
			await updateDoc(doc(db, 'userChats', authUser.uid), {
				[chatId + '.lastMessage']: {
					text,
					img: null
				},
				[chatId + '.date']: serverTimestamp()
			})

			await updateDoc(doc(db, 'userChats', user.uid), {
				[chatId + '.lastMessage']: {
					text,
					img: null
				},
				[chatId + '.date']: serverTimestamp()
			})
		} else if (groupId !== 'null') {
			await updateDoc(doc(db, 'chatGroups', groupId), {
				lastMessage: {
					text,	
					img: null
				},
				date: serverTimestamp()
			})
		}
	}

	const values = {
		messages,
		messagesEndRef,
		handleSend,
		findUserToSenderId,
		deleteMessage,
		updateTextMessage
	}

	return (
		<MessagesContext.Provider value={values}>
			{children}
		</MessagesContext.Provider>
	)
}

export default MessagesProvider
