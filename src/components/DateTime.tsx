import React from "react";

import { IonDatetime, IonDatetimeButton, IonModal } from "@ionic/react";

import "./DateTime.css";

const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

interface DateTimeProps {
  handleTimeChange: (e: CustomEvent) => void;
}

const DateTime: React.FC<DateTimeProps> = ({ handleTimeChange }) => {
  return (
    <div className="flex-container ion-padding">
      <IonDatetimeButton datetime="datetime">Open DateTime Picker</IonDatetimeButton>

      <IonModal keepContentsMounted={true}>
        <IonDatetime
          showDefaultTitle={true}
          doneText="Select"
          color="primary"
          locale="en-GB"
          onIonChange={handleTimeChange}
          min={today}
          id="datetime"
          firstDayOfWeek={1}
          showDefaultButtons={true}
          formatOptions={{
            date: {
              weekday: "long",
              month: "long",
              day: "2-digit",
            },
            time: {
              hour: "2-digit",
              minute: "2-digit",
            },
          }}
        >
          <span slot="title">Select a date and time for your event</span>
        </IonDatetime>
      </IonModal>
    </div>
  );
};

export default DateTime;
