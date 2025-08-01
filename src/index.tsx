import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import App from "./App.tsx";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloak } from "./keycloak/keycloak.ts";

const eventLogger = (event: string) => {
  if (event === "onAuthSuccess" || event === "onAuthRefreshSuccess") {
    localStorage.setItem("token", keycloak.token || "");
  }
  if (event === "onAuthLogout") {
    localStorage.removeItem("token");
  }
  if (event === "onAuthRefreshError") {
    console.error("Failed to refresh token, forcing logout...");
    keycloak.logout();
  }
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ReactKeycloakProvider
    // initOptions={{
    //   onLoad: "login-required",
    //   checkLoginIframe: false,
    //   pkceMethod: "S256",
    //   redirectUri: window.location.origin,
    // }}
    authClient={keycloak}
    onEvent={eventLogger}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ReactKeycloakProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
