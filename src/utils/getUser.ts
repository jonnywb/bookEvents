import { signInWithEmailAndPassword } from "firebase/auth";
import { User } from "../context/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/FirebaseConfig";

const getUserByEmailPw = async (email: string, password: string, setUser: (user: User | null) => void) => {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    if (firebaseUser) {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        setUser({ ...userData, uid: userSnap.id });
      }
    }
  } catch (error) {
    console.error("Error signing in:", error);
    // Handle sign-in error here
  }
};

const getUserById = async (id: string, setUser: (user: User | null) => void) => {
  try {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as User;
      setUser({ ...userData, uid: userSnap.id });
    } else {
      console.error(`User document with id ${id} does not exist.`);
      setUser(null); // Handle user document does not exist
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Handle error fetching user data here
  }
};

export { getUserByEmailPw, getUserById };
