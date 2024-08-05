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
      } else {
        throw new Error("User document does not exist.");
      }
    }
  } catch (error) {
    let errorMessage = "Error signing in.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
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
      setUser(null);
      throw new Error(`User document with id ${id} does not exist.`);
    }
  } catch (error) {
    throw new Error("Error fetching user data.");
  }
};

export { getUserByEmailPw, getUserById };
