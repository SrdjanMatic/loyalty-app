import { useKeycloak } from "@react-keycloak/web";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title: string;
  numberOfUnseenNotifications?: number;
  hasVipCard?: boolean;
  showBackArrow?: boolean; // Optional, defaults to true
}

const Header: React.FC<HeaderProps> = ({
  title,
  numberOfUnseenNotifications,
  hasVipCard,
  showBackArrow = true,
}) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + "/",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBackArrow && (
          <span
            title="Nazad"
            onClick={() => navigate("/restaurants")}
            style={{
              fontSize: 22,
              cursor: "pointer",
              opacity: 0.8,
              marginRight: 8,
              userSelect: "none",
            }}
          >
            ←
          </span>
        )}
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {numberOfUnseenNotifications !== undefined && (
          <span
            title="Notifications"
            onClick={() => navigate("/notification")}
            style={{
              fontSize: 22,
              cursor: "pointer",
              opacity: 0.8,
              position: "relative",
              display: "inline-block",
            }}
          >
            🔔
            {numberOfUnseenNotifications > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -8,
                  background: "#f44336",
                  color: "#fff",
                  borderRadius: "50%",
                  minWidth: 12,
                  height: 18,
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              >
                {numberOfUnseenNotifications}
              </span>
            )}
          </span>
        )}
        {hasVipCard !== undefined && (
          <span
            title={
              hasVipCard
                ? "VIP Program Active"
                : "Your company is not yet using the VIP program."
            }
            style={{
              fontSize: 22,
              cursor: hasVipCard ? "pointer" : "not-allowed",
              opacity: hasVipCard ? 1 : 0.5,
              color: hasVipCard ? "gold" : "gray",
            }}
            onClick={() => {
              if (hasVipCard) {
                navigate("/restaurant/vip");
              }
            }}
          >
            💳
          </span>
        )}

        {/* Settings Icon with Dropdown */}
        <div style={{ position: "relative" }}>
          <span
            onClick={() => setShowDropdown((v) => !v)}
            title="Settings"
            style={{
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ⚙️
          </span>
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "120%",
                right: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 10,
              }}
            >
              <div style={{ marginRight: 12 }}>
                <select
                  value={i18n.language}
                  onChange={(e) => {
                    i18n.changeLanguage(e.target.value);
                    localStorage.setItem("i18nextLng", e.target.value);
                  }}
                  style={{ fontSize: 14, padding: "2px 8px" }}
                  aria-label="Change language"
                >
                  <option value="en">English</option>
                  <option value="sr">Srpski</option>
                </select>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {t("Logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
