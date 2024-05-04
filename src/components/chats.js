import React, { useEffect, useRef } from 'react'
import { useChats } from '../hooks/useChats'
import { List } from '@mui/material'
import ChatList from './chatList'
import { useChatGroup } from '../hooks/useChatGroup'
import autoAnimate from '@formkit/auto-animate'

function Chats() {
	const { chats, dispatch } = useChats()
	const _groups = useChatGroup()

	const parent = useRef(null)

	useEffect(() => {
		parent.current && autoAnimate(parent.current)
	}, [parent])

	const handleSelect = user => {
		dispatch({ type: 'CHANGE_USER', payload: user })
		_groups.dispatch({ type: 'CLEAR_GROUP_ID' })
	}

	const handleGroupSelect = async group => {
		_groups.dispatch({ type: 'CHANGE_GROUP', payload: group })
		dispatch({ type: 'CLEAR_CHAT_ID' })
	}

	const allItems = Object.entries({ ...chats, ..._groups.groups })
		.filter(([key]) => key !== 'null')
		.sort((a, b) => b[1].date - a[1].date)

	return (
		<List
			ref={parent}
			sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
		>
			{allItems.length === 0 ? 'Пусто' : ''}
			{allItems.map(([key, item]) => {
				return (
					<>
						<ChatList
							key={item.groupId || key}
							handleSelect={item.groupId ? handleGroupSelect : handleSelect}
							chat={item.groupId ? undefined : [key, item]}
							group={item.groupId ? item : undefined}
						/>
					</>
				)
			})}
		</List>
	)
}

export default Chats
