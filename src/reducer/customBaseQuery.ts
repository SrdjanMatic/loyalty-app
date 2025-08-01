// src/keycloak/customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { keycloak } from "../keycloak/keycloak.ts";

export const customBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8082/api",
  prepareHeaders: async (headers) => {
    let token = localStorage.getItem("token");

    if (keycloak.authenticated && keycloak.token) {
      try {
        await keycloak.updateToken(30);
        token = keycloak.token;
        localStorage.setItem("token", token || "");
      } catch (err) {
        console.error("Keycloak token refresh failed:", err);
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
