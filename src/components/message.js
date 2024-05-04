import { Avatar, Typography, Box } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { formatTimestamp } from '../helper/formatTimestamp1'
import { useAuth } from '../hooks/useAuth'
import { useMessages } from '../hooks/useMessages'
import MessageMenu from './messageMenu'

function Message({ message }) {
	const [senderUser, setSenderUser] = useState(null)
	const { authUser } = useAuth()
	const { findUserToSenderId } = useMessages()

	const ref = useRef()

	const [menuAnchor, setMenuAnchor] = useState(null)

	useEffect(() => {
		ref.current?.scrollIntoView({ behavior: 'smooth' })
	}, [message])

	const isThisUser = message.senderId === authUser.uid

	const handleDoubleClick = event => {
		setMenuAnchor(event.currentTarget)
	}

	const handleCloseMenu = () => {
		setMenuAnchor(null)
	}

	useEffect(() => {
		async function getSender() {
			const sender = await findUserToSenderId(message.senderId)
			setSenderUser(sender)
		}
		getSender()
		return () => getSender()
	}, [findUserToSenderId, message.senderId])

	return (
		<>
			<Typography
				sx={{
					textAlign: (isThisUser && 'right') || 'left',
					fontSize: 14,
					color: 'white'
				}}
			>
				{formatTimestamp(message?.date)}
			</Typography>
			<Box
				ref={ref}
				display={'flex'}
				alignItems={'center'}
				justifyContent={isThisUser ? 'flex-end' : 'flex-start'}
				marginBottom={2}
			>
				<Box
					display={'flex'}
					alignItems={!isThisUser ? 'flex-start' : 'flex-end'}
					gap={1}
					flexDirection={message.img ? 'column' : 'row'}
				>
					{message.text.trim() !== '' && (
						<Box
							flexDirection={'row'}
							display={'flex'}
							alignItems={'center'}
							gap={1}
							onDoubleClick={handleDoubleClick}
						>
							{!isThisUser && <Avatar src={senderUser?.photoURL} alt='as' />}
							<Box
								padding={'6px 14px'}
								borderRadius={3}
								bgcolor={isThisUser ? '#1E88E5' : '#F5F5F5'}
								color={isThisUser ? '#fff' : '#424242'}
								boxShadow={'0px 2px 4px rgba(0, 0, 0, 0.1)'}
							>
								<p style={{ marginBlock: '0', fontSize: 15 }}>{message.text}</p>
							</Box>
						</Box>
					)}
					{message.img && (
						<img
							width={'300px'}
							src={message.img}
							alt=''
							onDoubleClick={handleDoubleClick}
							style={{ borderRadius: 5 }}
						/>
					)}
				</Box>
			</Box>
			<MessageMenu
				isThisUser={isThisUser}
				anchorEl={menuAnchor}
				handleClose={handleCloseMenu}
				message={message}
			/>
		</>
	)
}

export default Message
