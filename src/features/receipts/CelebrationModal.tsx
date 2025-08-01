import React from "react";
import { FaStar, FaMedal, FaRegSmileBeam } from "react-icons/fa";

const primaryColor = "#bfa16b";
const accentColor = "#fff";
const darkColor = "#222";

interface CelebrationModalProps {
  level: "PROMOTED_TO_PREMIUM" | "PROMOTED_TO_VIP";
  onOk: () => void;
}

const getLevelText = (level: CelebrationModalProps["level"]) => {
  if (level === "PROMOTED_TO_PREMIUM") return "PREMIUM";
  if (level === "PROMOTED_TO_VIP") return "VIP";
  return "";
};

const getCelebrationIcon = (level: CelebrationModalProps["level"]) => {
  if (level === "PROMOTED_TO_PREMIUM")
    return <FaMedal style={{ color: primaryColor, fontSize: 64 }} />;
  if (level === "PROMOTED_TO_VIP")
    return <FaStar style={{ color: "#ffd700", fontSize: 64 }} />;
  return <FaRegSmileBeam style={{ color: primaryColor, fontSize: 64 }} />;
};

const CelebrationModal: React.FC<CelebrationModalProps> = ({ level, onOk }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.65)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.5s",
      }}
    >
      <div
        style={{
          background: accentColor,
          borderRadius: 24,
          padding: "40px 32px 32px 32px",
          boxShadow: "0 8px 32px rgba(191,161,107,0.18)",
          textAlign: "center",
          minWidth: 320,
          maxWidth: "90vw",
          position: "relative",
          animation: "popIn 0.7s cubic-bezier(.17,.67,.83,.67)",
        }}
      >
        {/* Confetti animation (simple) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -30,
            height: 30,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i * 100) / 18}%`,
                top: `${Math.random() * 20}px`,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  i % 3 === 0
                    ? primaryColor
                    : i % 3 === 1
                    ? "#ffd700"
                    : "#ffb300",
                opacity: 0.8,
                animation: `confettiDrop 1.2s ${i * 0.08}s linear`,
              }}
            />
          ))}
        </div>
        <div style={{ marginBottom: 18 }}>{getCelebrationIcon(level)}</div>
        <h2
          style={{
            color: primaryColor,
            fontWeight: 900,
            fontSize: 28,
            marginBottom: 10,
            letterSpacing: 1,
          }}
        >
          Čestitamo!
        </h2>
        <div
          style={{
            color: darkColor,
            fontWeight: 700,
            fontSize: 20,
            marginBottom: 18,
          }}
        >
          Postali ste{" "}
          <span style={{ color: primaryColor }}>{getLevelText(level)}</span>{" "}
          član!
        </div>
        <div
          style={{
            color: "#555",
            fontSize: 16,
            marginBottom: 28,
            fontWeight: 500,
          }}
        >
          Uživajte u novim pogodnostima i ekskluzivnim kuponima.
        </div>
        <button
          style={{
            padding: "12px 36px",
            borderRadius: 10,
            border: "none",
            background: primaryColor,
            color: accentColor,
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(191,161,107,0.10)",
            transition: "background 0.2s",
          }}
          onClick={onOk}
        >
          OK
        </button>
      </div>
      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            0% { transform: scale(0.7); opacity: 0; }
            80% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
          }
          @keyframes confettiDrop {
            0% { top: -30px; opacity: 0.7; }
            100% { top: 30px; opacity: 0.1; }
          }
        `}
      </style>
    </div>
  );
};

export default CelebrationModal;
