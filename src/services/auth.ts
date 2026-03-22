import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../config/firebase'

const provider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase Auth no está configurado.')
  }

  await setPersistence(auth, browserLocalPersistence)
  return signInWithPopup(auth, provider)
}

export async function signOutFromGoogle() {
  if (!auth || !isFirebaseConfigured) {
    return
  }

  return signOut(auth)
}
