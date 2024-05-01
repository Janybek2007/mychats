import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material'
import React from 'react'
import { useChats } from '../hooks/useChats'
import { useChatGroup } from '../hooks/useChatGroup'

function ConfirmDelete(props) {
	const { confirmDelete, setConfirmDelete, groupId, chat, isAdmin } = props
	const { deleteChat } = useChats()
	const { deleteChatGroup } = useChatGroup()

	const handleDeleteChat = async () => {
		if (isAdmin && chat !== undefined) {
			await deleteChat(chat[0])
		}
		if (isAdmin && groupId !== undefined) {
			await deleteChatGroup(groupId)
		}
		setConfirmDelete(null)
	}
	return (
		<Dialog
			open={confirmDelete !== null}
			onClose={() => setConfirmDelete(null)}
		>
			<DialogTitle fontSize={18} lineHeight={1.4}>
				{confirmDelete}
			</DialogTitle>
			<DialogContent>
				<DialogContentText
					sx={{
						mb: 1
					}}
				>
					Это нельзя будет отменить!!!
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setConfirmDelete(null)} color='primary'>
					Отмена
				</Button>
				<Button onClick={handleDeleteChat} color='primary'>
					Удалить
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ConfirmDelete
