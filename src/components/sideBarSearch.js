import React, { useState } from 'react'
import { Box } from '@mui/material'
import UserFound from './userFound'
import UserSearch from './userSearch'

import SidebarController from './sidebarController'

function SideBarSearch() {
	const [name, setName] = useState('')
	const [err, setErr] = useState(false)
	const [isSearch, setIsSearch] = useState(false)
	const [found, setFound] = useState([])

	const [anchorEl, setAnchorEl] = useState(null)

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	function clear() {
		setFound([])
		setName('')
		setIsSearch(false)
	}

	const sidebarControllerProps = {
		clear: clear,
		setIsSearch: setIsSearch,
		isSearch: isSearch,
		handleClick: handleClick,
		anchorEl: anchorEl,
		handleClose: handleClose
	}

	const userSearchProps = {
		setFound: setFound,
		setErr: setErr,
		setName: setName,
		name: name,
		clear: clear
	}

	return (
		<>
			<Box>
				<SidebarController {...sidebarControllerProps} />
				{isSearch && <UserSearch {...userSearchProps} />}
				{err && <span>User not found!</span>}
				<UserFound clear={clear} found={found} />
			</Box>
		</>
	)
}

export default SideBarSearch
