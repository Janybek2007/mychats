import {
	createContext,
	useCallback,
	useEffect,
	useReducer,
	useState
} from 'react'
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	updateDoc,
	setDoc,
	getDocs,
	getDoc
} from '@firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './../hooks/useAuth'
import { useChats } from '../hooks/useChats'

export const ChatGroupContext = createContext()

const INITIAL_STATE = {
	groupId: JSON.parse(localStorage.getItem('groupId')) ?? 'null',
	group: {}
}

const ChatGroupProvider = ({ children }) => {
	const [groups, setGroups] = useState([])
	const { authUser } = useAuth()

	const _chats = useChats()

	const [state, dispatch] = useReducer(groupReducer, INITIAL_STATE)

	function groupReducer(state, action) {
		switch (action.type) {
			case 'SET_ID':
				return {
					groupId: action.payload
				}
			case 'CHANGE_GROUP':
				if (action.payload && action.payload.groupId) {
					const groupId = action.payload.groupId
					localStorage.setItem('groupId', JSON.stringify(groupId))
					localStorage.removeItem('chatId')
					return {
						group: action.payload,
						groupId: groupId
					}
				} else {
					console.error('Invalid action payload:', action.payload)
					return state
				}
			case 'CLEAR_GROUP_ID':
				localStorage.removeItem('groupId')
				return {
					groupId: 'null'
				}
			default:
				return state
		}
	}

	const addUserToChatGroup = async (groupId, userIds) => {
		try {
			const groupDocRef = doc(db, 'chatGroups', groupId)
			const groupDocSnapshot = await getDoc(groupDocRef)

			if (groupDocSnapshot.exists()) {
				const existingMembers = groupDocSnapshot.data().members || []
				const newMembers = userIds.filter(
					userId => !existingMembers.includes(userId)
				)

				if (newMembers.length > 0) {
					await updateDoc(groupDocRef, {
						members: arrayUnion(...newMembers)
					})
					getGroups()
				} else {
					console.log('All users are already members of the chat group.')
				}
			} else {
				console.error('Chat group does not exist.')
			}
		} catch (error) {
			console.error('Error adding user to chat group:', error)
		}
	}

	const changeGroupName = async (groupId, groupName) => {
		try {
			await updateDoc(doc(db, 'chatGroups', groupId), {
				groupName
			})
			getGroups()
		} catch (error) {
			console.error('Error adding user to chat group:', error)
		}
	}

	const removeUserFromChatGroup = async (groupId, userId) => {
		try {
			await updateDoc(doc(db, 'chatGroups', groupId), {
				members: arrayRemove(userId)
			})
			getGroups()
		} catch (error) {
			console.error('Error removing user from chat group:', error)
		}
	}

	const deleteChatGroup = async groupId => {
		try {
			await deleteDoc(doc(db, 'chatGroups', groupId))
			await deleteDoc(doc(db, 'chats', groupId))
			getGroups()
		} catch (error) {
			console.error('Error deleting chat group:', error)
		}
	}

	const createChatGroup = async (groupName, members, groupAvatar) => {
		try {
			const docRef = await addDoc(collection(db, 'chatGroups'), {
				groupName: groupName,
				members: members || [],
				admin: authUser.uid,
				groupAvatar: groupAvatar ?? ''
			})
			await setDoc(doc(db, 'chats', docRef.id), { messages: [] })

			_chats.dispatch({ type: 'CLEAR_CHAT_ID' })
			dispatch({
				type: 'SET_ID',
				payload: docRef.id
			})
			getGroups()
			return docRef.id
		} catch (error) {
			console.error('Error creating chat group:', error)
			return null
		}
	}

	const getGroups = useCallback(async () => {
		const userId = authUser?.uid

		let group = []
		const chatGroupRef = collection(db, 'chatGroups')
		const querySnapshot = await getDocs(chatGroupRef)

		querySnapshot.docs.forEach(doc => {
			const docData = doc.data()
			const userData = docData.members.find(member => member === userId)
			if (userData) {
				group.push({ ...docData, groupId: doc.id })
			}
		})
		setGroups(group)
	}, [authUser?.uid])

	useEffect(() => {
		const interval = setInterval(() => {
			authUser?.uid && getGroups()
			console.log('iii')
		}, 1200)

		return () => clearInterval(interval)
	}, [authUser?.uid, getGroups])

	const values = {
		groupId: state.groupId,
		group: state.group,
		dispatch,
		groups,
		addUserToChatGroup,
		removeUserFromChatGroup,
		deleteChatGroup,
		createChatGroup,
		getGroups,
		changeGroupName
	}

	return (
		<ChatGroupContext.Provider value={values}>
			{children}
		</ChatGroupContext.Provider>
	)
}

export default ChatGroupProvider
