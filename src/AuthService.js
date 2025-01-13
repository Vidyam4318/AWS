import { firebase } from './firebase'; // Assuming firebase is initialized in a separate file

const AuthService = {
    login: async (email, password) => {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const idTokenResult = await user.getIdTokenResult();
            return idTokenResult;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    logout: async () => {
        await firebase.auth().signOut();
    },

    getCurrentUser: () => {
        return firebase.auth().currentUser;
    }
};

export default AuthService;
