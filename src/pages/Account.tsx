import {
  getPlatforms,
  IonButton,
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
  IonIcon,
  IonInput,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React, { FormEvent, useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { checkmarkCircleOutline, personCircleSharp } from "ionicons/icons";
import { getUserById } from "../utils/getUser";

import "./Account.css";

import { useMaskito } from "@maskito/react";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";

import { auth, db, storage } from "../config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { Camera, CameraResultType } from "@capacitor/camera";
import { onAuthStateChanged } from "firebase/auth";
import Error from "../components/Error";

const Account: React.FC = () => {
  const { user, logout, setUser } = useUserContext();
  const router = useIonRouter();

  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [surname, setSurname] = useState<string>(user?.surname || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || "");
  const [city, setCity] = useState<string>(user?.city || "");
  const [profilePicture, setProfilePicture] = useState<string>(user?.profilePicture || "");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [image, setImage] = useState("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const maskitoOptions = maskitoPhoneOptionsGenerator({
    countryIsoCode: "GB",
    metadata,
  });

  const phoneMask = useMaskito({ options: maskitoOptions });

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not defined.");
      setErrorMessage("No user Detected.");
      setIsOpen(true);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    type updatedData = {
      firstName: string;
      surname: string;
      phoneNumber: string;
      city: string;
      profilePicture?: string;
    };

    if (!userDoc.exists()) {
      console.error(`User document with uid ${user.uid} not found.`);
      setErrorMessage("User document not found.");
      setIsOpen(true);
      return;
    }

    const userData = userDoc.data();

    interface UpdatedData {
      firstName?: string;
      surname?: string;
      phoneNumber?: string;
      city?: string;
      profilePicture?: string;
    }

    const updatedData: UpdatedData = {};

    if (userData) {
      if (userData?.firstName !== firstName) {
        updatedData.firstName = firstName;
      }

      if (userData?.surname !== surname) {
        updatedData.surname = surname;
      }

      if (userData?.phoneNumber !== phoneNumber) {
        updatedData.phoneNumber = phoneNumber;
      }

      if (userData?.city !== city) {
        updatedData.city = city;
      }

      if (image) {
        try {
          const imageUrl = await handleUpload();
          updatedData.profilePicture = imageUrl;
        } catch (error) {
          console.error("Error uploading image: ", error);
          setErrorMessage("Error uploading image.");
          setIsOpen(true);
        }
      }

      if (Object.keys(updatedData).length > 0) {
        try {
          await updateDoc(userDocRef, {
            ...updatedData,
          });
        } catch (error) {
          console.error("Error updating user document: ", error);
          setErrorMessage("Error updating user document.");
          setIsOpen(true);
          return;
        }
      } else {
        setErrorMessage("No changes to update");
        setIsOpen(true);
        console.log("No changes to update");
      }
    }

    const optimisticUser = {
      ...userData,
      ...updatedData,
    };

    setUser(optimisticUser as any);
  };

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const img = `data:image/jpeg;base64,${image.base64String}`;
    setImage(img);
  };

  const handleUpload = async (): Promise<string> => {
    if (image && user) {
      const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
      await uploadString(storageRef, image, "data_url");
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } else {
      console.log("Unable to upload image, please check you're logged in and have selected a new image.");
    }
    return "";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        getUserById(authUser.uid, setUser);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const displayProfilePicture = () => {
    if (profilePicture && !image) {
      return <img slot="icon-only" src={profilePicture} alt={user?.displayName} />;
    }

    if (profilePicture && image) {
      return <img slot="icon-only" src={image} alt={user?.displayName} />;
    }

    return <IonIcon slot="icon-only" icon={personCircleSharp} style={{ fontSize: "10em" }} />;
  };

  if (user) {
    const isDesktop = getPlatforms().includes("desktop");
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            {isDesktop && (
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
            )}

            <IonTitle>Account</IonTitle>
            <IonButton
              className="ion-margin-end"
              slot="end"
              onClick={async () => {
                await logout();
                router.push("/", "root");
              }}
            >
              Log Out
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid fixed>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12">
                <IonCard className="ion-padding profile-card author">
                  <IonRow className="ion-justify-content-center">
                    <IonCol size="auto">
                      <IonButton shape="round" onClick={() => setShowModal(true)} className="profileImageButton">
                        {displayProfilePicture()}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-justify-content-center">
                    <IonCol size="auto">
                      <IonText>
                        <p>Click image to change</p>
                      </IonText>
                    </IonCol>
                  </IonRow>

                  <IonCardHeader className="profile-header">
                    <IonCardTitle>Hello, {user.displayName}</IonCardTitle>
                    <IonCardSubtitle>{user.staffMember ? "Staff" : "User"} Profile</IonCardSubtitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <IonCard className="ion-padding">
                      <IonCardHeader>
                        <IonCardTitle>Update Personal Details</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <form onSubmit={(e) => handleUpdate(e)}>
                          <IonRow>
                            <IonCol>
                              <IonInput
                                fill="outline"
                                label="Email Address"
                                value={user.email}
                                disabled
                                class="disabled"
                              />
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="6">
                              <IonInput
                                type="text"
                                label="First Name"
                                value={firstName}
                                fill="outline"
                                labelPlacement="floating"
                                onIonInput={(e) => {
                                  setFirstName(e.detail.value || "");
                                }}
                              />
                            </IonCol>
                            <IonCol size="6">
                              <IonInput
                                type="text"
                                label="Surname"
                                value={surname}
                                fill="outline"
                                labelPlacement="floating"
                                onIonInput={(e) => {
                                  setSurname(e.detail.value || "");
                                }}
                              />
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="6">
                              <IonInput
                                type="text"
                                label="City"
                                value={city}
                                fill="outline"
                                labelPlacement="floating"
                                onIonInput={(e) => {
                                  setCity(e.detail.value || "");
                                }}
                              />
                            </IonCol>
                            <IonCol size="6">
                              <IonInput
                                ref={async (phoneInput) => {
                                  if (phoneInput) {
                                    const input = await phoneInput.getInputElement();
                                    phoneMask(input);
                                  }
                                }}
                                value={phoneNumber}
                                onIonInput={(e) => {
                                  setPhoneNumber(e.detail.value || "");
                                }}
                                type="tel"
                                label="Phone Number"
                                fill="outline"
                                labelPlacement="floating"
                                placeholder="+44 1234 567 890"
                              />
                            </IonCol>
                          </IonRow>
                          <IonRow className="ion-justify-content-end">
                            <IonCol size="auto">
                              <IonButton type="submit">
                                <IonIcon slot="start" icon={checkmarkCircleOutline} />
                                Update
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </form>
                      </IonCardContent>
                    </IonCard>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Upload Profile Picture</IonTitle>
                <IonButton slot="end" onClick={() => setShowModal(false)}>
                  Close
                </IonButton>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <img src={image || ""} alt="" />
              <IonButton expand="full" onClick={() => takePicture()}>
                <IonIcon slot="start" icon={personCircleSharp} />
                Take or Select Photo
              </IonButton>
            </IonContent>
          </IonModal>
          <Error isOpen={isOpen} message={errorMessage} setIsOpen={setIsOpen} />
        </IonContent>
      </IonPage>
    );
  }
};

export default Account;
