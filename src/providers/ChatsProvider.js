import { createContext, useEffect, useReducer, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { doc, onSnapshot, deleteDoc } from '@firebase/firestore'

export const ChatsContext = createContext()

const INITIAL_STATE = {
	chatId: JSON.parse(localStorage.getItem('chatId')) ?? 'null',
	user: JSON.parse(localStorage.getItem('user')) ?? {}
}

const ChatsProvider = ({ children }) => {
	const { authUser } = useAuth()
	const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)
	const [chats, setChats] = useState({})

	function chatReducer(state, action) {
		switch (action.type) {
			case 'CHANGE_USER':
				if (action.payload && action.payload.uid) {
					const chatId =
						authUser.uid > action.payload.uid
							? authUser.uid + action.payload.uid
							: action.payload.uid + authUser.uid
					localStorage.setItem('chatId', JSON.stringify(chatId))
					localStorage.setItem('user', JSON.stringify(action.payload))
					localStorage.removeItem('groupId')
					return {
						user: action.payload,
						chatId: chatId
					}
				} else {
					console.error('Invalid action payload:', action.payload)
					return state
				}
			case 'CLEAR_CHAT_ID':
				localStorage.removeItem('chatId')
				localStorage.removeItem('user')
				return {
					chatId: 'null',
					user: {}
				}

			default:
				return state
		}
	}

	function findChatId() {
		let chatId = {
			first: '',
			second: ''
		}
		let start = 0
		let end = 28
		const condition = authUser.uid === state.chatId.slice(start, end)
		if (!condition) {
			chatId = {
				first: state.chatId.slice(start, end),
				end: ''
			}
			start = end
			end = 56
		}
		chatId = {
			...chatId,
			end: state.chatId.slice(start, end)
		}
		return chatId
	}
	const deleteChat = async () => {
		try {
			if (state.chatId !== 'null') {
				await deleteDoc(doc(db, 'chats', state.chatId))
				await deleteDoc(doc(db, 'userChats', findChatId().first))
				await deleteDoc(doc(db, 'userChats', findChatId().second))
				dispatch({ type: 'CLEAR_CHAT_ID' })
			}
		} catch (error) {
			console.error('Error deleting chat group:', error)
		}
	}

	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(doc(db, 'userChats', authUser?.uid), doc => {
				setChats(doc.data())
			})

			return () => unsub()
		}

		authUser?.uid && getChats()
	}, [authUser?.uid])

	const values = {
		chatId: state.chatId,
		user: state.user,
		dispatch,
		chats,
		deleteChat
	}

	return (
		<ChatsContext.Provider value={values}>{children}</ChatsContext.Provider>
	)
}

export default ChatsProvider
