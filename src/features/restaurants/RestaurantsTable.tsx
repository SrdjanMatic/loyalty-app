import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import Header from "../../common/Header.tsx";
import { IoClose } from "react-icons/io5";
import { RestaurantSelect } from "./RestaurantSelect.tsx";
import { useGetNumberOfUnseenNotificationsQuery } from "../../reducer/notificationsApi.ts";
import {
  useGetRestaurantsQuery,
  useGetRestaurantsWithUserLoyaltyQuery,
} from "../../reducer/restaurantsApi.ts";
import { useCreateUserLoyaltyMutation } from "../../reducer/userLoyaltyApi.ts";
import { useTranslation } from "react-i18next"; // <-- Add this

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  marginBottom: 16,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const RestaurantsTable: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const { t } = useTranslation(); // <-- Add this

  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const hasVipCard = keycloak?.tokenParsed?.vipCard === "true";

  const { data: items = [] } = useGetRestaurantsQuery();
  const { data: restaurantsUserLoyalty = [], refetch: refetchUserLoyalty } =
    useGetRestaurantsWithUserLoyaltyQuery();
  const { data: unseenCount = 0, refetch: refetchUnseenCount } =
    useGetNumberOfUnseenNotificationsQuery();

  useEffect(() => {
    refetchUnseenCount();
  }, []);

  const [createUserLoyalty] = useCreateUserLoyaltyMutation();

  const activeRestaurants = restaurantsUserLoyalty.filter((r: any) => r.active);

  const activeRestaurantIds = restaurantsUserLoyalty
    .filter((r: any) => r.active)
    .map((r: any) => r.id);

  const availableItems = items.filter(
    (r: any) => !activeRestaurantIds.includes(r.id)
  );

  const handleCardClick = async (restaurantId: number, isActive: boolean) => {
    if (isActive) {
      navigate(`/restaurant/${restaurantId}/receipts`);
    } else {
      try {
        await createUserLoyalty(restaurantId).unwrap();
        refetchUserLoyalty();
      } catch (e) {
        // Optionally handle error
      }
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: "0 auto" }}>
      <Header
        title={t("Restaurants")}
        numberOfUnseenNotifications={unseenCount}
        hasVipCard={hasVipCard}
        showBackArrow={false}
      />

      <div style={{ marginBottom: 24 }}>
        <RestaurantSelect
          selected={selectedRestaurant}
          onChange={async (r) => {
            setSelectedRestaurant(r);
            try {
              await createUserLoyalty(r.id).unwrap();
              refetchUserLoyalty();
            } catch (e) {
              // Optionally handle error
            }
          }}
          items={availableItems}
        />
      </div>

      {activeRestaurants.map((r: any) => (
        <div
          key={r.id}
          style={{
            ...cardStyle,
            background: "#e6ffe6",
            border: "2px solid #4caf50",
            position: "relative",
          }}
          onClick={() => handleCardClick(r.id, r.active)}
        >
          <div style={{ fontWeight: 600, fontSize: 18 }}>{r.name}</div>
          <div style={{ color: "#555" }}>{r.address}</div>
          <div style={{ color: "#888" }}>{r.phone}</div>
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              background: "#f44336",
              color: "#fff",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 20,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
              zIndex: 2,
            }}
            title={t("Leave loyalty")}
          >
            <IoClose />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 16,
              background: "#4caf50",
              color: "#fff",
              borderRadius: "50%",
              width: 35,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {r.availablePoints}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantsTable;
