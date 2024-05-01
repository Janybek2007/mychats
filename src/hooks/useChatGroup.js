import { useContext } from 'react'
import { ChatGroupContext } from '../providers/ChatGroupProvider'

export const useChatGroup = () => useContext(ChatGroupContext)
