import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonButtons,
} from "@ionic/react";
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

interface PaymentProps {
  setPaymentComplete: (paymentComplete: boolean) => void;
  payAsYouFeel: boolean;
  price: number;
  eventId: string;
  setShowPayment: (showPayment: boolean) => void;
}

const Payment: React.FC<PaymentProps> = ({ setPaymentComplete, price, payAsYouFeel, eventId, setShowPayment }) => {
  const { user } = useUserContext();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [customPrice, setCustomPrice] = useState<number | undefined>(payAsYouFeel ? undefined : price);
  const [firstName, setFirstName] = useState<string>(user?.firstName ? user.firstName : "");
  const [surname, setSurname] = useState<string>(user?.surname ? user.surname : "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !user) {
      console.error("Stripe, Elements, or User not loaded");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("CardElement not found");
      setLoading(false);
      return;
    }

    try {
      const amount = customPrice ? customPrice * 100 : 0; // amount in pence

      const { data } = await axios.post("https://us-central1-bookevents-5bd5d.cloudfunctions.net/createPaymentIntent", {
        amount,
        userId: user.uid,
        eventId,
        firstName,
        surname,
        email: user.email,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${firstName} ${surname}`,
            email: user.email,
          },
        },
      });

      setLoading(false);

      if (error) {
        console.error("Payment error:", error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentComplete(true);
        setShowPayment(false);
      } else {
        console.error("Payment failed:", paymentIntent);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during payment", error);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    hidePostalCode: true,
    style: {
      base: {
        // Customize base style here
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Payment</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowPayment(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <form onSubmit={handleSubmit}>
                <IonItem>
                  <IonLabel position="stacked">First Name</IonLabel>
                  <IonInput type="text" value={firstName} onIonChange={(e) => setFirstName(e.detail.value!)} required />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Surname</IonLabel>
                  <IonInput type="text" value={surname} onIonChange={(e) => setSurname(e.detail.value!)} required />
                </IonItem>
                {payAsYouFeel ? (
                  <IonItem>
                    <IonLabel position="stacked">Enter your price:</IonLabel>
                    <IonInput
                      type="number"
                      value={customPrice}
                      onIonChange={(e) => setCustomPrice(Number(e.detail.value))}
                      required
                    />
                  </IonItem>
                ) : (
                  <IonItem>
                    <IonLabel>Amount due: £{price}</IonLabel>
                  </IonItem>
                )}
                <CardElement className="ion-margin" options={CARD_ELEMENT_OPTIONS} />
                <IonButton type="submit" disabled={!stripe || loading || !customPrice}>
                  {loading ? <IonLoading isOpen={loading} message={"Processing..."} /> : "Pay"}
                </IonButton>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Payment;
