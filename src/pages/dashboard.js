import { Box, Container } from '@mui/material'
import Header from '../components/header'
import SideBar from '../components/sideBar'
import Chat from '../components/chat'

const Dashboard = () => {
	return (
		<>
			<Header />
			<Container maxWidth='xl'>
				<Box
					display={'flex'}
					alignItems={'flex-start'}
					width={'100%'}
					py={2}
					height='93dvh'
					gap={2}
				>
					<SideBar />
					<Chat />
				</Box>
			</Container>
		</>
	)
}

export default Dashboard
