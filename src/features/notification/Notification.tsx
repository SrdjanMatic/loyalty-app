import React from "react";

import Header from "../../common/Header.tsx";
import {
  useGetAllNotificationsByUserQuery,
  useGetNumberOfUnseenNotificationsQuery,
} from "../../reducer/notificationsApi.ts";

type NotificationType = {
  id: number;
  title: string;
  description: string;
  valid_to: string;
  type: string;
};

const getStyles = (type: NotificationType["type"]) => {
  switch (type) {
    case "perfect_match":
      return {
        background: "white",
        borderLeft: "5px solid #ffb300",
        icon: "⭐",
        iconColor: "#ffb300",
        titleColor: "#ffb300",
        buttonBg: "#ffb300",
        buttonColor: "#fff",
      };
    case "food_match":
      return {
        background: "white",
        borderLeft: "5px solid #1976d2",
        icon: "🍔",
        iconColor: "#1976d2",
        titleColor: "#1976d2",
        buttonBg: "#1976d2",
        buttonColor: "#fff",
      };
    default:
      return {
        background: "white",
        borderLeft: "5px solid #bfa16b",
        icon: "🔔",
        iconColor: "#bfa16b",
        titleColor: "#bfa16b",
        buttonBg: "#bfa16b",
        buttonColor: "#fff",
      };
  }
};

const Notification: React.FC = () => {
  const {
    data: notifications = [],
    status,
    error,
  } = useGetAllNotificationsByUserQuery();

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        left: 16,
        zIndex: 3000,
        display: "flex",
        flexDirection: "column",
        maxWidth: 360,
        height: "100vh",
        overflowY: "auto",
        gap: 12,
      }}
    >
      <Header title="Notifications" />
      {notifications.map((item, idx) => {
        const styles = getStyles(item.type);
        return (
          <div
            key={idx}
            style={{
              background: styles.background,
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(191,161,107,0.10)",
              padding: "16px 0px 20px 20px",
              minWidth: 260,
              maxWidth: 340,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              borderLeft: styles.borderLeft,
              position: "relative",
              marginBottom: 4,
              backgroundImage: `
  linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)),
  url('https://thumbs.dreamstime.com/b/pasta-bechamel-sauce-thyme-mint-white-background-restaurant-menu-pasta-bechamel-sauce-thyme-270806383.jpg')
`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain", // or try "contain"
              backgroundPosition: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 6 }}
            >
              <span
                style={{
                  fontSize: 22,
                  marginRight: 8,
                  color: styles.iconColor,
                  display: "inline-block",
                }}
              >
                {styles.icon}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: styles.titleColor,
                }}
              >
                {item.title}
              </span>
              {item.type === "perfect_match" && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 18,
                    color: styles.iconColor,
                    fontWeight: 700,
                  }}
                  title="Perfect Match"
                >
                  ⭐
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, color: "#444", marginBottom: 8 }}>
              {item.description}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
              Važi: {item.validUntil}
            </div>
            <button
              style={{
                alignSelf: "flex-end",
                padding: "8px 22px",
                borderRadius: 8,
                border: "none",
                background: styles.buttonBg,
                color: styles.buttonColor,
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                letterSpacing: 1,
              }}
            >
              Rezerviši
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Notification;
