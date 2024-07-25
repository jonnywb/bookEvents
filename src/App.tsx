import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendarSharp, personSharp, searchSharp, starSharp } from "ionicons/icons";

import { UserContext } from "./context/UserContext";

import Home from "./pages/Home";
import Featured from "./pages/Featured";
import Search from "./pages/FindEvents";
import MyEvents from "./pages/myEvents";
import Account from "./pages/Account";
import AddEvent from "./pages/AddEvent";
import Event from "./pages/Event";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import FindEvents from "./pages/FindEvents";

setupIonicReact();

const App: React.FC = () => {
  const { user } = useContext(UserContext) || {};

  if (!user) {
    return (
      <IonApp>
        <IonReactRouter>
          <Route path="/" render={() => <Home />} />
        </IonReactRouter>
      </IonApp>
    );
  } else {
    return (
      <IonApp>
        <APIProvider
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          onLoad={() => {
            console.log("Maps API has loaded.");
          }}
        >
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to="/featured" />

                <Route path="/featured" render={() => <Featured />} exact={true} />
                <Route path="/find" render={() => <FindEvents />} exact={true} />
                <Route path="/myevents" render={() => <MyEvents />} exact={true} />
                <Route path="/account" render={() => <Account />} exact={true} />

                <Route path="/event/:id" render={() => <Event />} exact={true} />

                <Route path="/add-event" render={() => <AddEvent />} exact={true} />
              </IonRouterOutlet>

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
          </IonReactRouter>
        </APIProvider>
      </IonApp>
    );
  }
};

export default App;
