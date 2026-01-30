import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAaRXeafL8cJIYaWvkNP0bZZ7G2cXLx8d0",
    authDomain: "portfolio-builder-4b9c4.firebaseapp.com",
    projectId: "portfolio-builder-4b9c4",
    storageBucket: "portfolio-builder-4b9c4.firebasestorage.app",
    messagingSenderId: "281071602313",
    appId: "1:281071602313:web:c4f9a03874ac9d5c2a9458",
    measurementId: "G-HMNSCSC6WY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
