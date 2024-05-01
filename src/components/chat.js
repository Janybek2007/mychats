import React from 'react'
import Messages from './messages'
import SendMessageField from './sendMessageField'
import { Box } from '@mui/system'
import { useChats } from '../hooks/useChats'
import { useChatGroup } from '../hooks/useChatGroup'

function Chat() {
	const { chatId } = useChats()
	const { groupId } = useChatGroup()
	return (
		<Box width={'100%'} height={'100%'}>
			<Messages />
			{(chatId !== 'null' || groupId !== 'null') && <SendMessageField />}
		</Box>
	)
}

export default Chat
