import React from 'react'
import { useMessages } from './../hooks/useMessages'
import Message from './message'
import { Box } from '@mui/material'
import { useChats } from '../hooks/useChats'
import { useChatGroup } from '../hooks/useChatGroup'

function Messages() {
	const { messages, messagesEndRef } = useMessages()
	const { chatId } = useChats()
	const { groupId } = useChatGroup()
	return (
		<Box
			sx={{
				backgroundImage: `url('https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?cs=srgb&dl=pexels-vladalex94-1402787.jpg&fm=jpg')`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				// boxShadow: '0 0 5px #3b3b3b',
				display: 'flex',
				flexDirection: 'column',
				maxHeight: '100%',
				overflow: 'hidden',
				overflowY: 'scroll',
				'&::-webkit-scrollbar': {
					width: '0'
				}
			}}
			borderRadius={3}
			padding={'15px 10px'}
			height={chatId !== 'null' || groupId !== 'null' ? '93%' : '100%'}
			mb={2}
		>
			{messages?.map(m => (
				<Message message={m} key={m.id} />
			))}
			<div ref={messagesEndRef}></div>
		</Box>
	)
}

export default Messages
