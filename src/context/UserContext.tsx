import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/FirebaseConfig";
import { getUserById } from "../utils/getUser";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  myEvents?: string[];
  staffMember?: boolean;
  firstName?: string;
  surname?: string;
  city?: string;
  phoneNumber?: string;
  profilePicture?: string;
};

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface UserProviderProps {
  children: ReactNode;
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext can only be used in a UserProvider tree");
  }

  return context;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw new Error("Error logging out.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.uid) {
          await getUserById(firebaseUser.uid, setUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};
