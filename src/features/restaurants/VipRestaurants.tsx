import React, { useState } from "react";
import QRCode from "react-qr-code";

import {
  useGetVipRestaurantsQuery,
  VipRestaurant,
} from "../../reducer/vipRestaurantsApi.ts";

const primaryColor = "#bfa16b";
const accentColor = "#fff";

const VipRestaurants: React.FC = () => {
  const [showVipCard, setShowVipCard] = useState(false);

  const {
    data: vipRestaurants = [],
    status,
    error,
  } = useGetVipRestaurantsQuery();

  const user = {
    firstName: "John",
    lastName: "Doe",
    company: "Acme Corp",
  };

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>VIP Restaurants</h2>

      {vipRestaurants.map((r: VipRestaurant) => (
        <div
          key={r.id}
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 16,
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {/* Background image */}
          <div
            style={{
              backgroundImage: `url(${r.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: 180,
            }}
          />

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Cross
            </h3>
            <p
              style={{
                color: "#ffd700",
                fontSize: 18,
                fontWeight: 500,
                marginTop: 8,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {r.discount}% Off for VIP Members
            </p>
          </div>
        </div>
      ))}

      <button
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          background: primaryColor,
          color: accentColor,
          fontWeight: 700,
          fontSize: 20,
          padding: "18px 0",
          border: "none",
          borderRadius: 0,
          zIndex: 999,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
          cursor: "pointer",
          letterSpacing: 1,
        }}
        onClick={() => setShowVipCard(true)}
      >
        Pokazi VIP karticu
      </button>

      {showVipCard && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #d4af37, #c79d28)",
              borderRadius: 16,
              width: 400,
              height: 240,
              padding: 24,
              boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
              position: "relative",
              border: "2px solid #bfa16b",
              fontFamily: "'Arial', sans-serif",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Title */}
            <h2
              style={{
                textAlign: "center",
                margin: 0,
                fontSize: 22,
                color: "#333",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              VIP CARD
            </h2>

            {/* Content Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              {/* Left Side - User Info */}
              <div style={{ textAlign: "left", flex: 1 }}>
                <p
                  style={{
                    margin: "8px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#333",
                  }}
                >
                  {user.company}
                </p>
                <p style={{ margin: "4px 0", fontSize: 14, color: "#333" }}>
                  {user.firstName} {user.lastName}
                </p>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  height: "80%",
                  background: "#bfa16b",
                  margin: "0 16px",
                }}
              />

              {/* QR Code Side */}
              <div
                style={{
                  background: "#654321",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <QRCode
                  value="Test"
                  size={80}
                  bgColor="#654321"
                  fgColor="#ffd700"
                />
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowVipCard(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "transparent",
                border: "none",
                fontSize: 24,
                color: "#333",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VipRestaurants;
