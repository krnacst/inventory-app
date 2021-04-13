import firebase from "firebase";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
	apiKey: "**********",
	authDomain: "**********",
	databaseURL: "**********",
	projectId: "**********",
	storageBucket: "**********",
	messagingSenderId: "**********",
	appId: "**********"
};

firebase.initializeApp(firebaseConfig);


const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
	auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
	if (!user) return;

	const userRef = firestore.doc(`users/${user.uid}`);
	const snapshot = await userRef.get();
	
	if (!snapshot.exists) {
		const { uid, email, displayName, photoURL } = user;
		try {
			await userRef.set({
				uid,
				displayName,
				email,
				photoURL,
				shareWith: [],
				shareFrom: [],
				regDate: Date(),
				...additionalData
			});
		} catch (error) {
			console.error("Error creating user document", error);
		}
	}
	return getUserDocument(user.uid);
};
const getUserDocument = async uid => {
	if (!uid) return null;

	try {
		const userDocument = await firestore.doc(`users/${uid}`).get();
		return {
			uid,
			...userDocument.data()
		};
	} catch (error) {
		console.error("Error fetching user", error);
	}
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();