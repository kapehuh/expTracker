import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
}
console.log('Firebase config:', firebaseConfig);
// Проверка, что переменные загружены
if (!firebaseConfig.apiKey) {
  console.error('Firebase configuration is missing. Check your .env file.');
}

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);
// Экспортируем нужные сервисы
export const auth = getAuth(app);
export const db = getFirestore(app);

//export const storage = getStorage(app);
//export default app;