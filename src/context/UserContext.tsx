import { createContext, useState, ReactNode } from "react";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  myEvents?: string[];
  staffMember: boolean;
};

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface UserProviderProps {
  children: ReactNode;
}

//FOR TESTING PURPOSES ONLY
const jonnywb = {
  displayName: "Jonnywb",
  email: "jonnywb@gmail.com",
  uid: "WHCVp3kesTNvGY7o1mvN7jcRWz93",
  myEvents: ["6gAP30CnxsghOEK9UaHO"],
  staffMember: true,
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>({
    displayName: "Jonnywb",
    email: "jonnywb@gmail.com",
    uid: "WHCVp3kesTNvGY7o1mvN7jcRWz93",
    myEvents: ["6gAP30CnxsghOEK9UaHO"],
    staffMember: false,
  });
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
