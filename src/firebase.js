import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBp9x0nvdJdB6ibs8zaFAAGd2rVyUctOso",
  authDomain: "stillpages-f2acb.firebaseapp.com",
  projectId: "stillpages-f2acb",
  storageBucket: "stillpages-f2acb.firebasestorage.app",
  messagingSenderId: "993431726740",
  appId: "1:993431726740:web:d43a5ac1041a63c3856281"
};

const app = initializeApp(firebaseConfig);

export default app;