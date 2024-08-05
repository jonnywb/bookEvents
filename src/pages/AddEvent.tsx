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
  IonGrid,
  IonHeader,
  IonInput,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonButton,
  useIonRouter,
  IonToggle,
  IonLabel,
} from "@ionic/react";
import React, { useState } from "react";

import LocationPicker from "../components/LocationPicker";
import AddBook from "../components/AddBook";

import { db } from "../config/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

import { useUserContext } from "../context/UserContext";
import DateTime from "../components/DateTime";

const AddEvent: React.FC = () => {
  const { user } = useUserContext();
  const router = useIonRouter();

  const [eventName, setEventName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [featured, setFeatured] = useState<boolean>(false);

  const [selectedBook, setSelectedBook] = useState<any | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [maxAttendees, setMaxAttendees] = useState<number | null>(null);

  const [locationName, setLocationName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [payAsYouFeel, setPayAsYouFeel] = useState<boolean | null>(null);

  const [showPrice, setShowPrice] = useState<boolean>(false);
  const [price, setPrice] = useState<number | null>(null);

  const handleTimeChange = (e: CustomEvent) => {
    const value = e.detail.value;

    const date = new Date(value);

    setSelectedDate(date.toDateString());
    setSelectedTime(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const handleCategoryChange = (event: CustomEvent) => {
    const value = event.detail.value;

    setSelectedCategory(value);
  };

  const handleLocationChange = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && place?.name && place?.formatted_address) {
      setLocationName(place.name);
      setAddress(place.formatted_address);
      setLatitude(place.geometry?.location.lat());
      setLongitude(place.geometry?.location.lng());
    }
  };

  const handlePayfSelect = (event: CustomEvent) => {
    setPayAsYouFeel(event.detail.value);
    setShowPrice(!event.detail.value);
  };

  const handleFeaturedChange = () => {
    setFeatured(!featured);
  };

  const categories = [
    "Author Meet and Greet",
    "Book Trivia Night",
    "Book Launch",
    "Poetry Reading",
    "Literary Festival",
    "Writing Workshop",
  ];

  const createEvent = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !eventName ||
      !description ||
      !selectedCategory ||
      !locationName ||
      !address ||
      !latitude ||
      !longitude ||
      !selectedDate ||
      !selectedTime ||
      !user ||
      !selectedBook ||
      !maxAttendees
    ) {
      console.error("Please fill in all the fields, and make sure you are logged in.");
      return;
    }

    const eventData: any = {
      eventName,
      description,
      featured,
      numAttendees: 0,
      maxAttendees,
      category: selectedCategory,
      location: { locationName, address, lat: latitude, long: longitude },
      date: selectedDate,
      time: selectedTime,
      createdAt: new Date().toISOString(),
      staffUsername: user.displayName,
      payAsYouFeel,
      price: payAsYouFeel ? null : price,
    };

    eventData.bookDetails = selectedBook
      ? {
          authors: selectedBook.volumeInfo.authors,
          description: selectedBook.volumeInfo.description,
          image: selectedBook.volumeInfo.imageLinks?.thumbnail,
          biography: selectedBook.authorDetails?.biography,
          authorKey: selectedBook.authorDetails?.authorKey,
          title: selectedBook.volumeInfo.title,
        }
      : null;

    try {
      const docRef = await addDoc(collection(db, "events"), eventData);
      console.log("Document written with ID: ", docRef.id);
      router.push("/featured", "root");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

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
            <IonCol size="14" sizeSm="14" sizeLg="10" sizeXl="9">
              <IonCard className="ion-padding">
                <IonCardHeader>
                  <IonCardTitle>Create Event</IonCardTitle>
                  <IonCardSubtitle>Enter the details for your event</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={createEvent}>
                    <IonToggle
                      labelPlacement="end"
                      className="ion-padding-bottom"
                      checked={featured}
                      onIonChange={handleFeaturedChange}
                    >
                      <IonLabel>Featured Event</IonLabel>
                    </IonToggle>
                    <IonInput
                      type="text"
                      placeholder="Event Name"
                      label="Event Name"
                      labelPlacement="floating"
                      fill="outline"
                      mode="md"
                      clearInput
                      value={eventName}
                      onIonChange={(e) => setEventName(e.detail.value!)}
                    />
                    <IonSelect
                      fill="outline"
                      labelPlacement="floating"
                      label="Select Category"
                      value={selectedCategory}
                      placeholder="Select One"
                      onIonChange={handleCategoryChange}
                      interface="action-sheet"
                      mode="md"
                      className="ion-margin-top"
                    >
                      {categories.map((category, index) => (
                        <IonSelectOption key={index} value={category}>
                          {category}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
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
                      value={description}
                      onIonChange={(e) => setDescription(e.detail.value!)}
                    />

                    <IonInput
                      type="number"
                      placeholder="Max Attendees"
                      label="Max Attendees"
                      labelPlacement="floating"
                      fill="outline"
                      mode="md"
                      clearInput
                      value={maxAttendees}
                      onIonChange={(e) => setMaxAttendees(parseInt(e.detail.value!, 10))}
                      className="ion-margin-top"
                    />

                    <IonSelect
                      fill="outline"
                      label="Pay as you feel?"
                      value={payAsYouFeel}
                      placeholder="Select One"
                      onIonChange={handlePayfSelect}
                      labelPlacement="floating"
                      interface="action-sheet"
                      mode="md"
                      className="ion-margin-top"
                    >
                      <IonSelectOption value={true}>Yes</IonSelectOption>
                      <IonSelectOption value={false}>No</IonSelectOption>
                    </IonSelect>

                    {showPrice && (
                      <IonInput
                        type="number"
                        placeholder="Price"
                        label="Price"
                        labelPlacement="floating"
                        fill="outline"
                        mode="md"
                        clearInput
                        value={price}
                        onIonChange={(e) => setPrice(parseInt(e.detail.value!, 10))}
                        className="ion-margin-top"
                      />
                    )}

                    <LocationPicker onLocationChange={handleLocationChange} />

                    <IonRow className="ion-justify-content-center">
                      <IonCol size="12" sizeSm="8" sizeMd="6" className="ion-align-items-center">
                        <DateTime handleTimeChange={handleTimeChange} />
                      </IonCol>
                      <IonCol size="12" sizeSm="8" sizeMd="6">
                        <AddBook
                          selectedBook={selectedBook}
                          setSelectedBook={setSelectedBook}
                          selectedCategory={selectedCategory}
                        />
                      </IonCol>
                    </IonRow>
                    <IonButton type="submit" expand="block" className="ion-margin-top">
                      Create Event
                    </IonButton>
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

export default AddEvent;
