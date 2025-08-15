import React, { useEffect } from "react";
import RestaurantsTable from "./features/restaurants/RestaurantsTable.tsx";
import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReceiptsPage from "./features/receipts/ReceiptsPage.tsx";
import VipRestaurants from "./features/restaurants/VipRestaurants.tsx";
import Survey from "./features/survey/Survey.tsx";
import HomeRedirect from "./routes/HomeRedirect.tsx";
import Notification from "./features/notification/Notification.tsx";
import "./i18n.ts";

const App: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [initialized, keycloak]);

  if (!initialized) return <div>Loading...</div>;
  if (!keycloak.authenticated) return null;

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/restaurants" element={<RestaurantsTable />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/notification" element={<Notification />} />
          <Route
            path="/restaurant/:restaurantId/receipts"
            element={<ReceiptsPage />}
          />
          <Route path="/restaurant/vip" element={<VipRestaurants />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
