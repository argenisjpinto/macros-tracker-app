import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY', 'VITE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN', 'VITE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID', 'VITE_PROJECT_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET', 'VITE_STORAGE_BUCKET'),
  messagingSenderId: readEnv(
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_MESSAGING_SENDER_ID',
  ),
  appId: readEnv('VITE_FIREBASE_APP_ID', 'VITE_APP_ID'),
}

const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim().length > 0,
)

let auth: Auth | null = null
let db: Firestore | null = null

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error('Firebase no pudo inicializarse correctamente.', error)
  }
} else {
  console.warn(
    'Firebase no está configurado completamente. Revisa tus variables .env de Firebase.',
  )
}

export { auth, db, isFirebaseConfigured }

function readEnv(primaryKey: string, fallbackKey: string) {
  return import.meta.env[primaryKey] ?? import.meta.env[fallbackKey] ?? ''
}
