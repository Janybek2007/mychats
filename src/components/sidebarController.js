import React, { useState } from 'react'
import { IconButton, MenuItem, Menu } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useChatGroup } from '../hooks/useChatGroup'
import { useAuth } from '../hooks/useAuth'
import CreateGroup from './createGroup'
function SidebarController(props) {
	const { clear, setIsSearch, isSearch, handleClick, anchorEl, handleClose } =
		props
	const { authUser } = useAuth()
	const [openModal, setOpenModal] = useState()

	const { createChatGroup } = useChatGroup()

	const handleCreateGroup = async ({ groupName, groupAvatar }) => {
		const _members = [authUser.uid]

		const groupId = await createChatGroup(groupName, _members, groupAvatar)

		if (groupId) {
			console.log('Группа успешно создана с ID:', groupId)
		} else {
			console.error('Ошибка при создании группы')
		}

		handleClose()
	}

	return (
		<>
			<IconButton onClick={() => setIsSearch(prev => !prev)}>
				<SearchIcon />
			</IconButton>
			<IconButton disabled={!isSearch} onClick={clear}>
				<CloseIcon />
			</IconButton>
			<IconButton onClick={handleClick}>
				<MoreVertIcon />
			</IconButton>
			<CreateGroup
				onCreateGroup={handleCreateGroup}
				open={openModal}
				onClose={() => setOpenModal(false)}
			/>
			<Menu
				id='simple-menu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={() => setOpenModal(true)}>Создать группу</MenuItem>
			</Menu>
		</>
	)
}

export default SidebarController
