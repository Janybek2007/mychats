import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
	Avatar,
	Box,
	IconButton,
	ListItem,
	ListItemText,
	Menu,
	MenuItem
} from '@mui/material'
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChatGroup } from '../hooks/useChatGroup'
import { useChats } from '../hooks/useChats'
import EditGroup from './editGroup'
import ConfirmDelete from './confirmDelete'

function ChatList({ chat, handleSelect, group }) {
	const { chatId } = useChats()
	const { groupId } = useChatGroup()
	const { authUser } = useAuth()

	const [anchorEl, setAnchorEl] = useState(null)
	const [confirmDelete, setConfirmDelete] = useState(null)

	const [editModal, setEditModal] = useState(false)

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const user = !group ? chat[1]?.userInfo : group
	const lastMessage = !group ? chat[1]?.lastMessage : group?.lastMessage

	const avatarSrc =
		(user?.photoURL ?? group?.groupAvatar) || 'default-image-url'
	const primaryText = user?.displayName || group?.groupName || ''
	const secondaryText = lastMessage?.img ? 'Фоторгафии' : lastMessage?.text

	const boxShadow1 = chatId === (chat && chat[0]) ? '0 0 3px #121212' : ''
	const boxShadow2 = groupId === group?.groupId ? '0 0 3px #121212' : ''

	const isAdmin = group?.admin === authUser.uid

	return (
		<ListItem
			sx={{
				display: 'flex',
				alignItems: 'flex-start',
				cursor: 'pointer',
				borderRadius: 3,
				padding: 1,
				boxShadow: group ? boxShadow2 : boxShadow1,
				position: 'relative'
			}}
		>
			<Box
				display={'inline-flex'}
				onClick={() => handleSelect(!group ? chat[1].userInfo : group)}
				width={200}
			>
				<Avatar
					src={avatarSrc}
					alt=''
					sx={{
						marginRight: '10px'
					}}
				/>
				<ListItemText
					sx={{ margin: 0 }}
					primary={primaryText}
					secondary={secondaryText}
				/>
			</Box>

			<ConfirmDelete
				confirmDelete={confirmDelete}
				setConfirmDelete={setConfirmDelete}
				chat={chat ? chat : undefined}
				groupId={group ? group.groupId : undefined}
				isAdmin={isAdmin}
			/>
			<EditGroup
				group={group ? group : {}}
				open={editModal}
				onClose={() => setEditModal(false)}
			/>

			{!group && (
				<IconButton
					onClick={handleClick}
					sx={{
						position: 'absolute',
						top: 1,
						right: 1
					}}
				>
					<MoreVertIcon />
				</IconButton>
			)}
			{group && isAdmin && (
				<IconButton
					onClick={handleClick}
					sx={{
						position: 'absolute',
						top: 1,
						right: 1
					}}
				>
					<MoreVertIcon />
				</IconButton>
			)}
			<Menu
				id='simple-menu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{!group && (
					<MenuItem
						onClick={() => {
							const text = `Вы точно хотите удалить всю переписку с ${
								chat ? chat[1].userInfo?.displayName : ''
							}?`
							setConfirmDelete(text)
						}}
					>
						Удалить
					</MenuItem>
				)}
				{group && isAdmin && (
					<MenuItem
						onClick={() =>
							setConfirmDelete('Вы точно хотите удалить этот чат ?')
						}
					>
						Удалить
					</MenuItem>
				)}
				{group && isAdmin && (
					<MenuItem onClick={() => setEditModal(true)}>Изменить</MenuItem>
				)}
			</Menu>
		</ListItem>
	)
}

export default ChatList
