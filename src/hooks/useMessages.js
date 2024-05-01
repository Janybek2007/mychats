import { useContext } from 'react'
import { MessagesContext } from '../providers/MessagesProvider'

export const useMessages = () => useContext(MessagesContext)
