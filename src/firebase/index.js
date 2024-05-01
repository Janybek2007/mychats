import { getAuth } from '@firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Replace the following with your app's Firebase project configuration

const firebaseConfig = {
	apiKey: 'AIzaSyCy6a5a5_fdSkfcM848VGF5NP_3ZAUMSQE',
	authDomain: 'chat-app-c2999.firebaseapp.com',
	projectId: 'chat-app-c2999',
	storageBucket: 'chat-app-c2999.appspot.com',
	messagingSenderId: '328912180692',
	appId: '1:328912180692:web:294cbe2a0e0d5fcfcb7241',
	measurementId: 'G-2G2F5F3GV7'
}

// const firebaseConfig = {
// 	apiKey: 'AIzaSyCaBIkXJ3mvkhPMXTznZp28toRoqwfeh4s',
// 	authDomain: 'mychats-2f47e.firebaseapp.com',
// 	projectId: 'mychats-2f47e',
// 	storageBucket: 'mychats-2f47e.appspot.com',
// 	messagingSenderId: '204502097043',
// 	appId: '1:204502097043:web:758bd2e48645ed27470166',
// 	measurementId: 'G-HF1LKF6JNX'
// }

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)

export const storage = getStorage(app)
