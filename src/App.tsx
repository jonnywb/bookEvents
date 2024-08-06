import { useEffect, useRef, useState } from "react";
import { auth } from "./config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  getPlatforms,
  IonLoading,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonMenuButton,
  IonButtons,
  IonSplitPane,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendarSharp, personSharp, searchSharp, starSharp } from "ionicons/icons";
import { APIProvider } from "@vis.gl/react-google-maps";

import { getUserById } from "./utils/getUser";
import { useUserContext } from "./context/UserContext";

import Home from "./pages/Home";
import Featured from "./pages/Featured";
import FindEvents from "./pages/FindEvents";
import MyEvents from "./pages/myEvents";
import Account from "./pages/Account";
import AddEvent from "./pages/AddEvent";
import Event from "./pages/Event";
import Error from "./components/Error";

import "./App.css";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await getUserById(user.uid, setUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        setErrorMessage("An error occurred while trying to fetch user data.");
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  if (loading) {
    return <IonLoading isOpen={loading} message={"Please wait..."} />;
  }

  return (
    <IonApp>
      <IonReactRouter>
        {user ? <AuthenticatedApp isDesktop={getPlatforms().includes("desktop")} /> : <UnauthenticatedApp />}
      </IonReactRouter>
      <Error isOpen={isOpen} setIsOpen={setIsOpen} message={errorMessage} />
    </IonApp>
  );
};

const AuthenticatedApp: React.FC<{ isDesktop: boolean }> = ({ isDesktop }) => (
  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log("Maps API has loaded.")}>
    {isDesktop ? <DesktopLayout /> : <MobileLayout />}
  </APIProvider>
);

const UnauthenticatedApp: React.FC = () => (
  <IonRouterOutlet>
    <Route path="/" component={Home} />
  </IonRouterOutlet>
);

const MobileLayout: React.FC = () => (
  <>
    <IonRouterOutlet>
      <Redirect exact path="/" to="/featured" />
      <Route path="/featured" component={Featured} exact />
      <Route path="/find" component={FindEvents} exact />
      <Route path="/myevents" component={MyEvents} exact />
      <Route path="/account" component={Account} exact />
      <Route path="/event/:id" component={Event} exact />
      <Route path="/add-event" component={AddEvent} exact />
    </IonRouterOutlet>
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="featured" href="/featured">
          <IonIcon icon={starSharp} />
          <IonLabel>Featured</IonLabel>
        </IonTabButton>
        <IonTabButton tab="find" href="/find">
          <IonIcon icon={searchSharp} />
          <IonLabel>Find Events</IonLabel>
        </IonTabButton>
        <IonTabButton tab="myEvents" href="/myevents">
          <IonIcon icon={calendarSharp} />
          <IonLabel>My Events</IonLabel>
        </IonTabButton>
        <IonTabButton tab="account" href="/account">
          <IonIcon icon={personSharp} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </>
);

const DesktopLayout: React.FC = () => {
  const location = useLocation();
  const menuRef = useRef<HTMLIonMenuElement>(null);

  const closeMenu = () => {
    menuRef.current?.close();
  };

  return (
    <IonSplitPane when="xl" contentId="main-content">
      <IonMenu contentId="main-content" ref={menuRef}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem
              button
              routerLink="/featured"
              className={location.pathname === "/featured" ? "active" : ""}
              onClick={closeMenu}
            >
              <IonIcon icon={starSharp} slot="start" />
              <IonLabel>Featured</IonLabel>
            </IonItem>
            <IonItem
              button
              routerLink="/find"
              className={location.pathname === "/find" ? "active" : ""}
              onClick={closeMenu}
            >
              <IonIcon icon={searchSharp} slot="start" />
              <IonLabel>Find Events</IonLabel>
            </IonItem>
            <IonItem
              button
              routerLink="/myevents"
              className={location.pathname === "/myevents" ? "active" : ""}
              onClick={closeMenu}
            >
              <IonIcon icon={calendarSharp} slot="start" />
              <IonLabel>My Events</IonLabel>
            </IonItem>
            <IonItem
              button
              routerLink="/account"
              className={location.pathname === "/account" ? "active" : ""}
              onClick={closeMenu}
            >
              <IonIcon icon={personSharp} slot="start" />
              <IonLabel>Account</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonRouterOutlet id="main-content">
        <Redirect exact path="/" to="/featured" />
        <Route path="/featured" component={Featured} exact />
        <Route path="/find" component={FindEvents} exact />
        <Route path="/myevents" component={MyEvents} exact />
        <Route path="/account" component={Account} exact />
        <Route path="/event/:id" component={Event} exact />
        <Route path="/add-event" component={AddEvent} exact />
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

export default App;
