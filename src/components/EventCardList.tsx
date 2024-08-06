import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  useIonRouter,
  RefresherEventDetail,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonIcon,
  IonItem,
  IonImg,
} from "@ionic/react";
import React from "react";
import { cardOutline, star, starOutline, timeOutline } from "ionicons/icons";

import "./EventCardList.css";

interface EventsCardListProps {
  events: any[];
  getEvents: () => void;
}

const EventCardList: React.FC<EventsCardListProps> = ({ events, getEvents }) => {
  const router = useIonRouter();

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getEvents();
    event.detail.complete();
  };

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

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <IonRow className="ion-justify-content-center">
        {events.map((event: any) => {
          return (
            <IonCol key={event.id} size="12" sizeSm="10" sizeMd="6" sizeLg="6" sizeXl="4">
              <IonCard
                button={true}
                onClick={() => {
                  router.push("/event/" + event.id);
                }}
                className={cardClass(event.category)}
              >
                <IonCardHeader>
                  <IonGrid fixed>
                    <IonRow className="ion-justify-content-between">
                      <IonCol size="11">
                        <IonCardTitle>{event.eventName}</IonCardTitle>
                        <IonCardSubtitle>{event.category}</IonCardSubtitle>
                      </IonCol>
                      <IonCol size="1">
                        <IonIcon
                          style={{ fontSize: "1.5em" }}
                          icon={event.featured ? star : starOutline}
                          color={event.featured ? "warning" : "medium"}
                        />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardHeader>
                <IonCardContent>
                  <IonRow>
                    <IonCol size="12">
                      <IonText>
                        <p style={{ fontSize: "1.2em" }}>{event.date}</p>
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonGrid fixed>
                    <IonRow className="ion-justify-content-center">
                      <IonCol size="5">
                        {event.category === "Author Meet and Greet" || event.category === "Writing Workshop" ? (
                          <IonImg
                            src={`https://covers.openlibrary.org/a/olid/${event.bookDetails.authorKey}-M.jpg`}
                            alt={event.bookDetails.authors}
                          />
                        ) : (
                          <IonImg src={event.bookDetails.image} alt={event.eventName} />
                        )}
                      </IonCol>
                      <IonCol>
                        <IonText>
                          {event.description.length > 180 ? (
                            <p>
                              {event.description.substring(0, 180)}...{" "}
                              <span style={{ color: "var(--ion-color-primary-shade)" }}>Read More</span>
                            </p>
                          ) : (
                            event.description
                          )}
                        </IonText>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="6">
                        <IonItem lines="none" color="none">
                          <IonIcon icon={timeOutline} />
                          <IonText className="ion-padding">
                            <h2>{event.time}</h2>
                          </IonText>
                        </IonItem>
                      </IonCol>
                      <IonCol size="6">
                        <IonItem lines="none" color="none">
                          <IonIcon icon={cardOutline} />
                          <IonText className="ion-padding">
                            <h2>{event.payAsYouFeel ? "Pay as you feel" : "£" + event.price.toFixed(2)}</h2>
                          </IonText>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          );
        })}
      </IonRow>
    </>
  );
};

export default EventCardList;
