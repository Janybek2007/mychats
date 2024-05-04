import { Menu, MenuItem, TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { useMessages } from '../hooks/useMessages'

function MessageMenu({ handleClose, anchorEl, message, isThisUser }) {
	const [editText, setEditText] = useState(message.text)
	const [isEdit, setIsEdit] = useState(false)

	const { updateTextMessage, deleteMessage } = useMessages()

	const handleEditMessage = async () => {
		await updateTextMessage(message.id, editText)
		setIsEdit(false)
		handleClose()
	}

	const handleDeleteMessage = async () => {
		const is = anchorEl.src ? 'img' : 'text'
		await deleteMessage(message.id, is)
		handleClose()
	}

	return (
		<Menu
			id='demo-positioned-menu'
			aria-labelledby='demo-positioned-button'
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={handleClose}
			sx={{
				top: '5%'
			}}
			anchorOrigin={{
				vertical: 'top',
				horizontal: isThisUser ? 'right' : 'left'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: isThisUser ? 'right' : 'left'
			}}
		>
			{isEdit && (
				<MenuItem>
					<TextField
						value={editText}
						onChange={e => setEditText(e.target.value)}
						onKeyDown={async e => {
							if (e.key === 'Enter') {
								await handleEditMessage()
							}
						}}
						variant='standard'
						fullWidth
					/>

					<Button
						disabled={editText === message.text}
						size='small'
						sx={{ ml: 1, px: 3 }}
						onClick={handleEditMessage}
						color='inherit'
					>
						Изменить
					</Button>
				</MenuItem>
			)}
			{!isEdit && !anchorEl?.src && isThisUser && (
				<MenuItem onClick={() => setIsEdit(true)}>Изменить</MenuItem>
			)}
			<MenuItem onClick={handleDeleteMessage}>Удалить</MenuItem>
		</Menu>
	)
}

export default MessageMenu
