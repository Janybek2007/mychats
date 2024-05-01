import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton
} from '@mui/material'
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import DeleteIcon from '@mui/icons-material/Delete'
import { useChatGroup } from '../hooks/useChatGroup'

function GroupMembers({ group, onDeleteMember }) {
	const { users } = useAuth()
	const { members, groupId, admin } = group

	const { removeUserFromChatGroup } = useChatGroup()

	const filteredMembers = users
		.filter(user => members.includes(user.uid))
		.map(member => ({
			...member,
			isAdmin: admin === member.uid
		}))

	const handleDelete = async uid => {
		if (uid && groupId) {
			await removeUserFromChatGroup(groupId, uid)
		}
	}

	return (
		<List disablePadding>
			{filteredMembers.map(member => (
				<ListItem sx={{ py: 0.5 }} disablePadding key={member.uid}>
					<ListItemText
						primary={member.displayName}
						secondary={member.isAdmin ? 'Админ' : ''}
					/>
					{!member.isAdmin && (
						<ListItemSecondaryAction>
							<IconButton
								edge='end'
								aria-label='delete'
								onClick={() => handleDelete(member.uid)}
							>
								<DeleteIcon />
							</IconButton>
						</ListItemSecondaryAction>
					)}
				</ListItem>
			))}
		</List>
	)
}

export default GroupMembers
