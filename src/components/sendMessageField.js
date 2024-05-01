import React, { useState } from 'react'
import { Button, TextField, IconButton } from '@mui/material'
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material'
import { useMessages } from '../hooks/useMessages'
import { Box } from '@mui/system'

function SendMessageField() {
	const [text, setText] = useState('')
	const [img, setImg] = useState(null)

	const { handleSend } = useMessages()

	async function sendMessage() {
		if (!text && !img) {
			return
		}

		setText('')

		try {
			await handleSend(text, img)
			setImg(null)
			setText('')
		} catch (error) {
			console.error('Error during message sending:', error)
		}
	}

	function onKeySendMessage(e) {
		if (e.keyCode === 13) {
			sendMessage()
		}
	}

	return (
		<Box maxWidth={'100%'} display={'flex'} alignItems={'center'}>
			<TextField
				fullWidth
				type='text'
				size='small'
				placeholder='Your Message...'
				onKeyDown={onKeySendMessage}
				onChange={e => setText(e.target.value)}
				value={text}
			/>
			<Box maxWidth={'100%'} display={'flex'} alignItems={'center'}>
				<input
					type='file'
					style={{ display: 'none' }}
					id='file'
					onChange={e => setImg(e.target.files[0])}
				/>
				<label htmlFor='file'>
					<IconButton component='span'>
						<PhotoCameraIcon className='text-[#000000] text-2xl' />
					</IconButton>
				</label>
				<Button onClick={sendMessage} variant='contained'>
					Send
				</Button>
			</Box>
		</Box>
	)
}

export default SendMessageField
