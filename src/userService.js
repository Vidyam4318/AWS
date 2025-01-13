// userService.js
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';

const checkUserStatus = async (email) => {
    const userRef = doc(firestore, 'users', email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        throw new Error('User not found.');
    }
};

const isAccountExpired = (lastLogin) => {
    const currentDate = new Date();
    const lastLoginDate = new Date(lastLogin);
    const differenceInDays = (currentDate - lastLoginDate) / (1000 * 60 * 60 * 24);

    return differenceInDays > 30; // Expiry threshold of 30 days
};

const updateLastLogin = async (email) => {
    const userRef = doc(firestore, 'users', email);
    await updateDoc(userRef, {
        lastLogin: new Date().toISOString(),
    });
};

export { checkUserStatus, isAccountExpired, updateLastLogin };
