import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import FB from "../config/FirebaseConfig";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  calendarClearOutline,
  cardOutline,
  flameSharp,
  pencilOutline,
  pinSharp,
  star,
  starOutline,
  timeOutline,
} from "ionicons/icons";
import { UserContext } from "../context/UserContext";

import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";

const Event: React.FC = () => {
  const [eventData, setEventData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [eventFull, setEventFull] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const db = getFirestore(FB);
  const { user } = useContext(UserContext) || {};

  const fetchEvent = async () => {
    if (id) {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const newData = { id: docSnap.id, ...docSnap.data() } as any;
        setEventData(newData);
        if (newData.attendees?.includes(user?.uid)) {
          setSignedUp(true);
        }
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    if (!id || !user) return;
    setIsLoading(true);
    fetchEvent();
    setIsLoading(false);
  }, [id, user]);

  const cardClass = (category: string) => {
    switch (category) {
      case "Author Meet and Greet":
        return "author";
      case "Literary Festival":
        return "literary";
      case "Book Trivia Night":
        return "trivia";
      case "Book Launch":
        return "launch";
      case "Poetry Reading":
        return "poetry";
      case "Writing Workshop":
        return "workshop";
    }
  };

  const handleSignUp = async () => {
    const signUp = await eventSignUp();
    if (signUp) {
      setSignedUp(true);
    }
  };

  const eventSignUp = async () => {
    if (user?.uid && eventData.numAttendees < eventData.maxAttendees) {
      // Add event to user's myEvents array
      const userRef = doc(db, "users", user.uid);

      try {
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            myEvents: arrayUnion(id),
          });
          console.log(`Event added successfully to user ${user.uid}`);
        } else {
          console.log(`User with ID ${user.uid} not found`);
          return false;
        }
      } catch (err) {
        // ADD ERROR HANDLING
        console.error("Error adding event to user: ", err);
        return false;
      }

      // Add user to event's attendees array and increment numAttendees
      const eventRef = doc(db, "events", id);

      try {
        const eventDoc = await getDoc(eventRef);
        if (eventDoc.exists()) {
          await updateDoc(eventRef, {
            attendees: arrayUnion(user.uid),
            numAttendees: eventDoc.data().numAttendees + 1,
          });
          console.log(`User added successfully to event ${id}`);
        } else {
          // ADD ERROR HANDLING AND REMOVE USER FROM MYEVENTS ARR
          console.log("Event with ID ${id} not found");
          return false;
        }
      } catch (err) {
        // ADD ERROR HANDLING AND REMOVE USER FROM MYEVENTS ARR
        console.error("Error adding user to event: ", err);
        return false;
      }
    } else {
      // ADD ERROR HANDLING
      console.log("Please log in to sign up to this event");
      console.log("User: ", user);
      console.log("attendees full: ", eventData.numAttendees, "<", eventData.maxAttendees);
      return false;
    }

    return true;
  };

  const prepareEventData = () => {
    const createdAtDateTime = new Date(eventData.createdAt);

    const createdAtDate =
      createdAtDateTime.getDate() + "/" + (createdAtDateTime.getMonth() + 1) + "/" + createdAtDateTime.getFullYear();

    const createdAtTime = createdAtDateTime.getHours() + ":" + createdAtDateTime.getMinutes();

    const remainingPlaces = eventData.maxAttendees - eventData.numAttendees;

    if (remainingPlaces <= 0) {
      setEventFull(true);
    }

    return { remainingPlaces, createdAtDate, createdAtTime };
  };

  if (isLoading) {
    return <IonContent className="ion-padding">Loading...</IonContent>;
  } else if (eventData) {
    const { remainingPlaces, createdAtDate, createdAtTime } = prepareEventData();
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Event</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className={"ion-padding " + cardClass(eventData.category)} fullscreen>
          <IonGrid fixed className="ion-padding" style={{ boxShadow: "0px 1px 0px black" }}>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeMd="3">
                <div
                  className="ion-padding"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {eventData.category === "Author Meet and Greet" || eventData.category === "Writing Workshop" ? (
                    <img
                      style={{ maxHeight: "100%" }}
                      src={`https://covers.openlibrary.org/a/olid/${eventData.bookDetails.authorKey}-M.jpg`}
                      alt={eventData.bookDetails.authors}
                    />
                  ) : (
                    <img style={{ maxHeight: "100%" }} src={eventData.bookDetails.image} alt={eventData.eventName} />
                  )}
                </div>
              </IonCol>

              <IonCol size="12" sizeMd="9">
                <IonRow>
                  <IonCol size="11.5">
                    <IonCardTitle>{eventData.eventName}</IonCardTitle>
                    <IonCardSubtitle>{eventData.category}</IonCardSubtitle>
                  </IonCol>
                  <IonCol size="0.5">
                    <IonIcon
                      style={{ fontSize: "1.5em" }}
                      icon={eventData.featured ? star : starOutline}
                      color={eventData.featured ? "warning" : "medium"}
                    />
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="none" color="none">
                      <IonIcon icon={calendarClearOutline} />
                      <IonText className="ion-margin-start">
                        <p>{eventData.date}</p>
                      </IonText>
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol>
                    <IonText>{eventData.description}</IonText>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem color="none" lines="none">
                  <IonIcon icon={pinSharp} slot="start" />
                  <IonText>
                    <p>
                      {eventData.location.locationName}
                      {eventData.location.address && ", " + eventData.location.address + "."}
                    </p>
                  </IonText>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <Map
                  mapId="3aa0adfb734f90b7"
                  defaultCenter={{ lat: eventData.location.lat, lng: eventData.location.long }}
                  defaultZoom={13}
                  gestureHandling={"greedy"}
                  disableDefaultUI={true}
                  style={{ height: "30vh", width: "100%" }}
                >
                  <AdvancedMarker position={{ lat: eventData.location.lat, lng: eventData.location.long }} />
                </Map>
              </IonCol>
            </IonRow>

            <IonRow className="ion-justify-content-between ion-align-items-center">
              <IonCol size="4">
                <IonItem lines="none" color="none" style={{ width: "100%" }}>
                  <IonIcon icon={timeOutline} />
                  <IonText className="ion-margin-start">
                    <p>{eventData.time}</p>
                  </IonText>
                </IonItem>
              </IonCol>
              <IonCol size="4">
                <IonItem lines="none" color="none" style={{ width: "100%" }}>
                  <IonIcon icon={cardOutline} />
                  <IonText className="ion-margin-start">
                    <p>{eventData.payAsYouFeel ? "Pay as you feel" : "£" + eventData.price.toFixed(2)}</p>
                  </IonText>
                </IonItem>
              </IonCol>
              <IonCol
                size="4"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                {remainingPlaces <= 5 && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IonIcon style={{ fontSize: "1.2em", marginRight: "0.3em" }} color="danger" icon={flameSharp} />
                    <p style={{ fontSize: "0.8em" }}>Only {remainingPlaces} places remaining!</p>
                  </div>
                )}

                <IonButton onClick={handleSignUp} disabled={signedUp || eventFull}>
                  <IonIcon slot="start" icon={pencilOutline}></IonIcon>
                  {signedUp ? "Already Signed Up" : "Sign Up to Event"}
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" style={{ display: "flex", justifyContent: "end" }}>
                <IonText>
                  <p style={{ fontSize: "0.8em", color: "var(--ion-color-dark-tint)" }}>
                    Event Created: {createdAtDate} at {createdAtTime}
                  </p>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }
};

export default Event;
