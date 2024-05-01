import { Navigate, Route, Routes } from 'react-router-dom'
import Index from './pages'
import Dashboard from './pages/dashboard'
import { useAuth } from './hooks/useAuth'
import { useEffect } from 'react'
import { addUserToDatabase } from './firebase/firestore'
import Providers from './providers'

const AuthenticatedRoute = ({ children }) => {
	const { authUser } = useAuth()

	useEffect(() => {
		if (authUser) {
			addUserToDatabase(authUser)
		}
	}, [authUser])

	if (!authUser) return <Navigate to='/' />

	return children
}

function App() {
	return (
		<Providers>
			<Routes>
				<Route path='/' element={<Index />} />
				<Route
					path='/dashboard'
					element={
						<AuthenticatedRoute>
							<Dashboard />
						</AuthenticatedRoute>
					}
				/>
			</Routes>
		</Providers>
	)
}

export default App
