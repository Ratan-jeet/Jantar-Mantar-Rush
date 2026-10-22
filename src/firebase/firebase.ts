import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, type Firestore } from 'firebase/firestore';

// Safely load local config if present without causing build failure when omitted
const localConfigFiles = import.meta.glob<{ default?: Record<string, string> }>(
  '/firebase-applet-config.json',
  { eager: true }
);
const localConfig = localConfigFiles['/firebase-applet-config.json']?.default || {};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey
);

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || 'mock-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId || '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || '(default)',
};

let firestoreInstance: Firestore;

try {
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  firestoreInstance = getFirestore(app, config.firestoreDatabaseId);
} catch (error) {
  console.warn('Firebase initialized in fallback offline mode:', error);
  firestoreInstance = {} as unknown as Firestore;
}

export const db = firestoreInstance;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test
export async function testFirestoreConnection(): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or network constrained, fallback will operate.');
      return false;
    }
    // Non-fatal if test doc does not exist
    return true;
  }
}
