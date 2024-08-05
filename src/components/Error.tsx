// Error.tsx
import { IonToast } from "@ionic/react";
import React from "react";

interface ErrorProps {
  message: string;
  duration?: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Error: React.FC<ErrorProps> = ({ message, duration = 2000, isOpen, setIsOpen }) => {
  return (
    <IonToast
      isOpen={isOpen}
      onDidDismiss={() => setIsOpen(false)}
      message={message}
      duration={duration}
      position="bottom"
      color="danger"
    />
  );
};

export default Error;
