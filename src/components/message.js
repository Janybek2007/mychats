import { Avatar, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import { formatTimestamp } from '../helper/formatTimestamp1'
import { useAuth } from '../hooks/useAuth'
import { useMessages } from '../hooks/useMessages'

function Message({ message }) {
	const [senderUser, setSenderUser] = useState(null)
	const { authUser } = useAuth()
	const { findUserToSenderId } = useMessages()

	const ref = useRef()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedMessage, setSelectedMessage] = useState(null)

	useEffect(() => {
		ref.current?.scrollIntoView({ behavior: 'smooth' })
	}, [message])

	const isThisUser = message.senderId === authUser.uid

	const handleOpenModal = message => {
		setSelectedMessage(message)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => setIsModalOpen(false)

	useEffect(() => {
		async function get() {
			const sender = await findUserToSenderId(message.senderId)
			setSenderUser(sender)
		}
		get()
		return () => get()
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
					alignItems={'flex-start'}
					gap={1}
					flexDirection={message.img ? 'column' : 'row'}
				>
					{message.text.trim() !== '' && (
						<Box
							flexDirection={'row'}
							display={'flex'}
							alignItems={'center'}
							gap={1}
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
							onClick={() => handleOpenModal(message)}
							style={{ cursor: 'pointer', borderRadius: 5 }}
						/>
					)}
				</Box>
			</Box>
			<Modal
				open={isModalOpen}
				onClose={handleCloseModal}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<img width={'50%'} src={isModalOpen && selectedMessage.img} alt='' />
			</Modal>
		</>
	)
}

export default Message
