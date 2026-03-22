import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { Theme } from '../App'
import type { LoggedMealsByDate } from '../components/log/types'
import type { ProfileState } from '../components/profile/types'
import { db, isFirebaseConfigured } from '../config/firebase'

export type PersistedUserData = {
  loggedMealsByDate: LoggedMealsByDate
  profilesByWeek: Record<string, ProfileState>
  theme: Theme
}

const APP_STORAGE_PREFIX = 'macros-tracker-app'

export async function loadUserAppState(userId: string) {
  const localData = readLocalUserData(userId)

  if (!db || !isFirebaseConfigured) {
    return localData
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId, 'app', 'state'))

    if (!userDoc.exists()) {
      return localData
    }

    const remoteData = sanitizePersistedUserData(userDoc.data())
    if (remoteData) {
      writeLocalUserData(userId, remoteData)
    }
    return remoteData
  } catch (error) {
    console.error('No se pudo cargar la información del usuario desde Firestore.', error)
    return localData
  }
}

export async function saveUserAppState(userId: string, data: PersistedUserData) {
  writeLocalUserData(userId, data)

  if (!db || !isFirebaseConfigured) {
    return
  }

  try {
    await setDoc(doc(db, 'users', userId, 'app', 'state'), data, { merge: true })
  } catch (error) {
    console.error('No se pudo guardar la información del usuario en Firestore.', error)
  }
}

export function readLocalUserData(userId: string) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const serialized = window.localStorage.getItem(buildStorageKey(userId))
    if (!serialized) {
      return null
    }

    return sanitizePersistedUserData(JSON.parse(serialized))
  } catch (error) {
    console.error('No se pudo leer la información local del usuario.', error)
    return null
  }
}

function writeLocalUserData(userId: string, data: PersistedUserData) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(buildStorageKey(userId), JSON.stringify(data))
  } catch (error) {
    console.error('No se pudo guardar la información local del usuario.', error)
  }
}

function buildStorageKey(userId: string) {
  return `${APP_STORAGE_PREFIX}:${userId}`
}

function sanitizePersistedUserData(data: unknown): PersistedUserData | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const candidate = data as Partial<PersistedUserData>

  if (
    !candidate.loggedMealsByDate ||
    typeof candidate.loggedMealsByDate !== 'object' ||
    !candidate.profilesByWeek ||
    typeof candidate.profilesByWeek !== 'object' ||
    (candidate.theme !== 'light' && candidate.theme !== 'dark')
  ) {
    return null
  }

  return {
    loggedMealsByDate: candidate.loggedMealsByDate,
    profilesByWeek: candidate.profilesByWeek,
    theme: candidate.theme,
  }
}
