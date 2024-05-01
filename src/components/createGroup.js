import React, { useState } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button
} from '@mui/material'

function CreateGroup({ onCreateGroup, onClose, open }) {
	const [groupName, setGroupName] = useState('')
	const [groupAvatar, setGroupAvatar] = useState('')

	const handleCreateGroup = () => {
		if (groupName) {
			onCreateGroup({ groupName, groupAvatar })
			onClose()
		}
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Создание группы</DialogTitle>
			<DialogContent>
				<TextField
					label='Название группы'
					value={groupName}
					onChange={e => setGroupName(e.target.value)}
					fullWidth
					margin='normal'
				/>
				<TextField
					label='Аватар группы (URL, необязетльно)'
					value={groupAvatar}
					onChange={e => setGroupAvatar(e.target.value)}
					fullWidth
					margin='normal'
				/>
				<Button onClick={handleCreateGroup} variant='contained' color='primary'>
					Создать
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default CreateGroup
