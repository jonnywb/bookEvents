import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FB from "../config/FirebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { calendarClearOutline, cardOutline, pencilOutline, star, starOutline, timeOutline } from "ionicons/icons";

const Event: React.FC = () => {
  const [eventData, setEventData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  const db = getFirestore(FB);

  const fetchEvent = async () => {
    if (id) {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const newData = { id: docSnap.id, ...docSnap.data() };
        setEventData(newData);
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchEvent();
    setIsLoading(false);
  }, [id]);

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

  if (isLoading) {
    return <IonContent className="ion-padding">Loading...</IonContent>;
  } else if (eventData) {
    const createdAtDateTime = new Date(eventData.createdAt);

    const createdAtDate =
      createdAtDateTime.getDate() + "/" + (createdAtDateTime.getMonth() + 1) + "/" + createdAtDateTime.getFullYear();
    const createdAtTime = createdAtDateTime.getHours() + ":" + createdAtDateTime.getMinutes();

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
            <IonRow className="ion-justify-content-center ">
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
              <IonCol size="4">
                <IonButton style={{ width: "100%" }}>
                  <IonIcon slot="start" icon={pencilOutline}></IonIcon>
                  Sign Up to Event
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
