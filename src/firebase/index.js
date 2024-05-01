import { getAuth } from '@firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Replace the following with your app's Firebase project configuration

// const firebaseConfig = {
// 	apiKey: 'AIzaSyCy6a5a5_fdSkfcM848VGF5NP_3ZAUMSQE',
// 	authDomain: 'chat-app-c2999.firebaseapp.com',
// 	projectId: 'chat-app-c2999',
// 	storageBucket: 'chat-app-c2999.appspot.com',
// 	messagingSenderId: '328912180692',
// 	appId: '1:328912180692:web:294cbe2a0e0d5fcfcb7241',
// 	measurementId: 'G-2G2F5F3GV7'
// }

const firebaseConfig = {
	apiKey: 'AIzaSyAC1SSvE_1x9zgemxvKMBvXbt-_jGIf8jo',
	authDomain: 'mychats-1c8a0.firebaseapp.com',
	databaseURL: 'https://mychats-1c8a0-default-rtdb.firebaseio.com',
	projectId: 'mychats-1c8a0',
	storageBucket: 'mychats-1c8a0.appspot.com',
	messagingSenderId: '731663533725',
	appId: '1:731663533725:web:acab1fe17c452d9b16f674'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)

export const storage = getStorage(app)
