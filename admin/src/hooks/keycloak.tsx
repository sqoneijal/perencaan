import type { KeycloakProfile } from "keycloak-js";
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
   url: import.meta.env.VITE_KEYCLOAK_URL,
   realm: import.meta.env.VITE_KEYCLOAK_REALM,
   clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const initKeycloak = async (): Promise<{ keycloak: Keycloak; user: KeycloakProfile } | null> => {
   if (typeof window === "undefined" || !window.crypto?.subtle) {
      console.warn("Web Crypto API not available — Keycloak not initialized.");
      return null;
   }

   const options = {
      onLoad: "check-sso" as const,
      checkLoginIframe: false,
   };

   const authenticated = await keycloak.init(options);

   if (authenticated && !keycloak.isTokenExpired()) {
      const user = await keycloak.loadUserInfo();
      return { keycloak, user };
   } else {
      keycloak.login();
      return null;
   }
};

export const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
   e.preventDefault();
   if (keycloak?.logout) {
      keycloak.logout({
         redirectUri: import.meta.env.VITE_API_BASE_URL,
      });
   } else {
      console.warn("Keycloak belum diinisialisasi.");
   }
};

export default keycloak;
