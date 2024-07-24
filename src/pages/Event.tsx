import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FB from "../config/FirebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

type BookEvent = {
  id: string;
  eventName: string;
  description: string;
  date: string;
  createdAt: string;
  time: string;
  location: {
    lat: number;
    long: number;
  };
  payAsYouFeel: boolean;
  price: number | null;
  //attendees?
  bookDetails?: {
    authors: string[];
    description: string;
    image: string;
    title: string;
  };
};

const Event: React.FC = () => {
  const [eventData, setEventData] = useState<BookEvent | null>(null);
  const [loading, isLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  const db = getFirestore(FB);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        const docRef = doc(db, "events", id); // Adjust 'events' to your collection name
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const newData = { id: docSnap.id, ...docSnap.data() } as BookEvent;
          setEventData(newData);
        } else {
          console.log("No such document!");
        }
        isLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <IonContent className="ion-padding">Loading...</IonContent>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{eventData?.eventName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center" style={{ height: "30vh", width: "100%" }}>
            <IonCol size="4" style={{ height: "100%" }}>
              <img
                src={eventData?.bookDetails?.image}
                alt={eventData?.bookDetails?.title + "cover"}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              ></img>
            </IonCol>
            <IonCol size="8">
              <p>{eventData?.description}</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Event;
