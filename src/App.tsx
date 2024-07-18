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
import { calendarSharp, listSharp, newspaperSharp, personSharp, searchSharp } from "ionicons/icons";

import { UserContext } from "./context/UserContext";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Categories from "./pages/Categories";
import Search from "./pages/Search";
import MyEvents from "./pages/myEvents";
import Account from "./pages/Account";
import CreateEvent from "./pages/CreateEvent";

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
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact path="/" to="/events" />

              <Route path="/events" render={() => <Events />} exact={true} />
              <Route path="/categories" render={() => <Categories />} exact={true} />
              <Route path="/search" render={() => <Search />} exact={true} />
              <Route path="/myevents" render={() => <MyEvents />} exact={true} />
              <Route path="/account" render={() => <Account />} exact={true} />

              <Route path="/create-event" render={() => <CreateEvent />} exact={true} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="events" href="/events">
                <IonIcon icon={newspaperSharp} />
                <IonLabel>Events</IonLabel>
              </IonTabButton>
              <IonTabButton tab="categories" href="/categories">
                <IonIcon icon={listSharp} />
                <IonLabel>Categories</IonLabel>
              </IonTabButton>
              <IonTabButton tab="search" href="/search">
                <IonIcon icon={searchSharp} />
                <IonLabel>Search</IonLabel>
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
      </IonApp>
    );
  }
};

export default App;
