import { useContext } from 'react'
import { ChatsContext } from '../providers/ChatsProvider'

export const useChats = () => useContext(ChatsContext)
