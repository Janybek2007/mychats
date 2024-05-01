import React from 'react'
import ChatGroupProvider from './ChatGroupProvider'
import ChatsProvider from './ChatsProvider'
import MessagesProvider from './MessagesProvider'
import AuthProvider from './AuthProvider'
import { BrowserRouter } from 'react-router-dom'

function Providers({ children }) {
	return (
		<BrowserRouter>
			<AuthProvider>
				<ChatsProvider>
					<ChatGroupProvider>
						<MessagesProvider>{children}</MessagesProvider>
					</ChatGroupProvider>
				</ChatsProvider>
			</AuthProvider>
		</BrowserRouter>
	)
}

export default Providers
