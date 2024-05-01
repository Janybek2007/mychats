import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField
} from '@mui/material'
import React, { useState } from 'react'
import GroupMembers from './groupMembers'
import AddUserToGroup from './addUserToGroup'
import { useChatGroup } from '../hooks/useChatGroup'

function EditGroup({ open, onClose, group }) {
	const [groupName, setGroupName] = useState(group.groupName)
	const [addUserOpen, setAddUserOpen] = useState(false)
	const { addUserToChatGroup, changeGroupName } = useChatGroup()

	const handleAddUser = async userIds => {
		if (group && group.groupId) {
			await addUserToChatGroup(group.groupId, userIds)
		}
		setAddUserOpen(false)
	}

	async function save() {
		await changeGroupName(group.groupId, groupName)
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle fontSize={18} lineHeight={1.4}>
				Редактирование группы
			</DialogTitle>
			<AddUserToGroup
				open={addUserOpen}
				onClose={() => setAddUserOpen(false)}
				members={group.members}
				handle={handleAddUser}
			/>
			<DialogContent sx={{ width: 460 }}>
				<DialogContentText pb={1}>
					Редактировать название группы
				</DialogContentText>
				<TextField
					autoFocus
					margin='dense'
					id='groupName'
					label='Название группы'
					type='text'
					fullWidth
					size='small'
					value={groupName}
					onKeyDown={async e => {
						if (e.key === 'Enter') {
						}
					}}
					onChange={e => setGroupName(e.target.value)}
				/>
				<Box
					padding={0}
					display={'flex'}
					alignItems={'center'}
					justifyContent={'space-between'}
					mt={1}
				>
					<DialogContentText>Ползователи</DialogContentText>
					<Button onClick={() => setAddUserOpen(true)} size='small'>
						Добавить пользователя
					</Button>
				</Box>
				<GroupMembers group={group} />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='primary'>
					Отмена
				</Button>
				<Button
					onClick={save}
					disabled={group.groupName === groupName}
					color='primary'
				>
					Сохранить
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default EditGroup
