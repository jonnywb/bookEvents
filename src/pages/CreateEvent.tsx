import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import LocationPicker from "../components/LocationPicker";

const CreateEvent: React.FC = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const createEvent = () => {};

  const handleTimeChange = (e: CustomEvent) => {
    const value = e.detail.value;
    setSelectedDateTime(e.detail.value);

    const date = new Date(value);

    setSelectedDate(date.toDateString());
    setSelectedTime(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const handleCategoryChange = (event: CustomEvent) => {
    setSelectedCategory(event.detail.value);
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const categories = [
    "Author Meet and Greet",
    "Book Trivia Night",
    "Book Launch",
    "Poetry Reading",
    "Literary Festival",
    "Writing Workshop",
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Create Event</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="13" sizeMd="12" sizeLg="11" sizeXl="10">
              <IonCard className="ion-padding">
                <IonCardHeader>
                  <IonCardTitle>Create Event</IonCardTitle>
                  <IonCardSubtitle>Enter the details for your event</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={createEvent}>
                    <IonInput
                      type="text"
                      placeholder="Event Name"
                      label="Event Name"
                      labelPlacement="floating"
                      fill="outline"
                      mode="md"
                      clearInput
                    />
                    <IonTextarea
                      placeholder="Description"
                      label="Description"
                      labelPlacement="floating"
                      fill="outline"
                      mode="md"
                      className="ion-margin-top"
                      counter={true}
                      autoGrow={true}
                      maxlength={500}
                    />
                    <div>
                      <IonSelect
                        fill="outline"
                        label="Select Category"
                        value={selectedCategory}
                        placeholder="Select One"
                        onIonChange={handleCategoryChange}
                        labelPlacement="floating"
                        interface="action-sheet"
                      >
                        {categories.map((category, index) => (
                          <IonSelectOption key={index} value={category}>
                            {category}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                    {/*REPLACE WITH LOCATION COMPONENT */}
                    <LocationPicker />
                    <div className="ion-padding">
                      <IonLabel>Pick a Date and Time:</IonLabel>
                      <IonDatetime onIonChange={handleTimeChange} min={today} />
                      {selectedDateTime && (
                        <div>
                          <p>Selected DateTime: {selectedDateTime}</p>
                          <p>Selected Date: {selectedDate}</p>
                          <p>Selected Time: {selectedTime}</p>
                        </div>
                      )}
                    </div>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateEvent;
