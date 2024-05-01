import { Box } from '@mui/system'
import SideBarSearch from './sideBarSearch'
import Chats from './chats'

function SideBar() {
	return (
		<Box
			width={'300px'}
			minWidth={'300px'}
			height={'100%'}
			borderRadius={4}
			padding={2}
			sx={{
				boxShadow: '0 0 5px #3b3b3b'
			}}
		>
			<SideBarSearch />
			<Chats />
		</Box>
	)
}

export default SideBar
