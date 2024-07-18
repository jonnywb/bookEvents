import {
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonItemOption,
  IonItemSliding,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const Categories: React.FC = () => {
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
          <IonTitle>Categories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="13">
              <IonList>
                {categories.map((category, i) => (
                  <IonItem key={i} lines="none">
                    <IonCard className="ion-padding">{category}</IonCard>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Categories;
