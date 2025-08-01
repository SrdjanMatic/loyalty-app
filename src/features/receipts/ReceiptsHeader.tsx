import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCoins, FaArrowLeft } from "react-icons/fa";

interface ReceiptsHeaderProps {
  configData: any;
  goldTokens: number | undefined;
  showBackArrow?: boolean;
}

const ReceiptsHeader: React.FC<ReceiptsHeaderProps> = ({
  configData,
  goldTokens,
  showBackArrow = true,
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: configData?.headerAndButtonColor,
        boxShadow: "0 4px 24px 0 rgba(191,161,107,0.10)",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 480,
        minHeight: 70,
        position: "relative",
      }}
    >
      {/* Back arrow in top left corner */}
      {showBackArrow && (
        <button
          onClick={() => navigate("/restaurants")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "50%",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
          aria-label="Nazad na restorane"
        >
          <FaArrowLeft
            style={{
              fontSize: 18,
            }}
          />
        </button>
      )}

      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "#fff",
          border: `2px solid ${configData?.headerAndButtonColor}`,
          boxShadow: "0 2px 8px rgba(191,161,107,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
          flexShrink: 0,
        }}
      >
        <img
          src={configData?.logo}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: 900,
          color: configData?.fontColor,
          fontSize: 16,
          lineHeight: 1.1,
          letterSpacing: 0.2,
          minWidth: 0,
          margin: "0 10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        <span style={{ fontWeight: 900 }}>
          {configData?.restaurantDisplayName}
        </span>
        <span style={{ fontWeight: 900 }}>{configData?.description}</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f8f5ee",
          borderRadius: 18,
          padding: "6px 14px 6px 10px",
          boxShadow: "0 2px 8px 0 rgba(191,161,107,0.07)",
          fontWeight: 700,
          fontSize: 16,
          color: configData?.headerAndButtonColor,
          marginLeft: 10,
          minWidth: 0,
        }}
      >
        <FaCoins
          style={{
            color: configData?.headerAndButtonColor,
            fontSize: 20,
            marginRight: 6,
          }}
        />
        <span
          style={{ fontWeight: 700, color: configData?.headerAndButtonColor }}
        >
          {goldTokens}
        </span>
      </div>
    </div>
  );
};

export default ReceiptsHeader;
