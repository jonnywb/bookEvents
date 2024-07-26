import { createContext, useState, ReactNode } from "react";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  attendees?: string[];
};

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>({
    displayName: "Jonnywb",
    email: "jonnywb@gmail.com",
    uid: "WHCVp3kesTNvGY7o1mvN7jcRWz93",
  });
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
