import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch } from "../../store/store.ts";
import api from "../../keycloak/interceptors.ts";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Wheel } from "react-custom-roulette";
import { FaInfoCircle } from "react-icons/fa";
import ReceiptsHeader from "./ReceiptsHeader.tsx";

import CelebrationModal from "./CelebrationModal.tsx";
import { useGetCouponsQuery } from "../../reducer/couponsApi.ts";
import {
  useAddGamePointsMutation,
  useGetReceiptsQuery,
} from "../../reducer/receiptsApi.ts";
import {
  useGetUserLoyaltyQuery,
  usePromoteUserLoyaltyMutation,
} from "../../reducer/userLoyaltyApi.ts";
import {
  Challenge,
  RestaurantConfigData,
  useGetRestaurantChallengeQuery,
  useGetRestaurantConfigDataQuery,
} from "../../reducer/restaurantsApi.ts";

interface WheelAvailablePoints {
  receiptKey: string;
  receiptPoints: number;
  wheelData: number[];
}

const darkColor = "#222";
const accentColor = "#fff";

const ReceiptsPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const restaurantIdNumber = Number(restaurantId);
  const dispatch = useDispatch<AppDispatch>();
  const { data: receipts = [], refetch: refetchReceipts } =
    useGetReceiptsQuery(restaurantIdNumber);
  const { data: coupons = [], refetch: refetchCoupons } =
    useGetCouponsQuery(restaurantIdNumber);
  const { data: userLoyalty, refetch: refetchUserLoyalty } =
    useGetUserLoyaltyQuery(restaurantIdNumber);
  const [addGamePoints] = useAddGamePointsMutation();
  const {
    data: restaurantChallenges = [],
    refetch: refetchRestaurantChallenges,
  } = useGetRestaurantChallengeQuery(restaurantIdNumber);
  const { data: configData } =
    useGetRestaurantConfigDataQuery(restaurantIdNumber);

  const [promoteUserLoyalty] = usePromoteUserLoyaltyMutation();

  const [showScanner, setShowScanner] = useState(false);
  const [wheelData, setWheelData] = useState<WheelAvailablePoints | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [pointsWon, setPointsWon] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"receipts" | "coupons">(
    "receipts"
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const [challengeScales, setChallengeScales] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    if (
      userLoyalty?.level === "PROMOTED_TO_PREMIUM" ||
      userLoyalty?.level === "PROMOTED_TO_VIP"
    ) {
      setShowCelebration(true);
    }
  }, [userLoyalty?.level]);

  useEffect(() => {
    if (showWheel && restaurantIdNumber) {
      refetchRestaurantChallenges();
    }
  }, [restaurantIdNumber, showWheel, dispatch]);

  // Initialize challengeScales when showWheel opens or restaurantChallenges change
  useEffect(() => {
    if (showWheel && restaurantChallenges) {
      const initial: { [key: number]: number } = {};
      restaurantChallenges.forEach((ch: Challenge, idx: number) => {
        initial[idx] = ch.visitsCompleted; // default value
      });
      setChallengeScales(initial);
    }
  }, [showWheel, restaurantChallenges]);

  const fakeScanner = async () => {
    const receiptData =
      "A1daTksyRFFDV1pOSzJEUUOVIQEASCABAEghagQAAAAAAAABl4Tu+8AAAAAzF/udiOiCaUDX0yph/KQQjFkUs6UZzfnyZfWyrOGFwwWY4Xl6F0rnJ2LJFpWaPhMNpp2x2Qizm9Ytz+0R7eNBkJ15J96yUdng0Nt6pNQS7pg9bO2i4obbHjYSXZmm53oRGWd8v0TjzHB0IKAgkq8VyQxPNuJA07i7gWhDGNA/qOifrM0Yxo6IHE9UOza5B/9DqOrvVYK4R+USeCxvpAOFgRS0rI6z2QPFo0yRIJ/4ZTez2UUIe5HQLm1w1mt1vaWSzS90BjyTzcIXegeR1zmx5G9XXvozeUlS4LHcWUVi76U6xrYtWqlP4hhTz76Azypqzd0ipF98geSgv4aazfwPlCYBUKulLbwjCo34mRxHDnxvUnr+NtFw0n+gZ2c8aATC+9C4mYRB6yQ1/CkQAfbE0UyvdrWmrBbEeEstuPck6L0u0Il6m57QKLqtpoOtV1iydL4R2w/XDB8BTLU0BDTXt2mL9w3YN9pd4fHgg3qLOJINAwtvSopEIT8i5/78wjO1tocri5ElACHbVzPjUAyiUkzfGoNyRsfYXrjOButQoa3IGRtnprENAoKzBV/1DH417L7gNrnhE8PNf18Q23AWTbErr4FfHkL3rX/kN8U4OGsAUtP8UgMybn/IVTBLAZqbaGFLIoRcOMEJKjkul8c+CTIvzdYXQiecPmERHa7Z7m+T6V+1dh7rKICjjeSGVE8=";

    try {
      const response = await api.post<WheelAvailablePoints>(
        "http://localhost:8082/api/receipt/create-receipt",
        { rowData: receiptData }
      );
      setWheelData(response.data);

      if (restaurantId) {
        await refetchReceipts();
        await refetchUserLoyalty();
        await refetchCoupons();
      }
      setShowWheel(true);
      setPointsWon(null);
    } catch (error) {
      setWheelData(null);
    }
    setShowScanner(false);
  };

  const generateWheelData = (wheelDataValues: number[]) => {
    const wheelData: {
      option: string;
      style: {
        backgroundColor: string;
        textColor: string;
      };
    }[] = [];

    for (let i = 0; i < wheelDataValues.length; i++) {
      wheelData.push({
        option: wheelDataValues[i].toString(),
        style: {
          backgroundColor: i % 2 === 0 ? "#fff" : "#bfa16b",
          textColor: "#222",
        },
      });
    }

    return wheelData;
  };

  const handleStartWheel = () => {
    if (wheelData) {
      const random = Math.floor(
        Math.random() * generateWheelData(wheelData.wheelData).length
      );
      setPrizeNumber(random);
      setMustSpin(true);
    }
  };

  const handleWheelStop = () => {
    if (wheelData) {
      const points = Number(
        generateWheelData(wheelData.wheelData)[prizeNumber].option
      );
      setMustSpin(false);

      setPointsWon(points);

      const completedChallenge = restaurantChallenges.find(
        (challenge: any) =>
          challenge.visitsCompleted >= challenge.visitsRequired
      );
      const challengeId = completedChallenge ? completedChallenge.id : null;

      if (challengeId) {
        try {
          addGamePoints({
            receiptKey: wheelData?.receiptKey || "",
            gamePoints: points,
            challengeId: challengeId,
          }).unwrap();

          // Optionally, refetch receipts and user loyalty if needed
          // If you use RTK Query for user loyalty, call its refetch method
          // For receipts, you can use the refetch function from useGetReceiptsQuery:
          // const { refetch } = useGetReceiptsQuery(Number(restaurantId));
          // refetch();

          if (restaurantId) {
            //fetch receipts again
            refetchUserLoyalty();
          }
        } catch (error) {
          // handle error if needed
        }
      }
    }
  };

  const getCouponLimit = (configData: RestaurantConfigData) => {
    return userLoyalty?.level === "STANDARD" ||
      userLoyalty?.level === "PROMOTED_TO_PREMIUM"
      ? configData?.premiumCouponLimit
      : userLoyalty?.level === "PREMIUM" ||
        userLoyalty?.level === "PROMOTED_TO_VIP"
      ? configData?.vipCouponLimit
      : 5000;
  };

  const getCouponNextLevel = () => {
    return userLoyalty?.level === "STANDARD" ||
      userLoyalty?.level === "PROMOTED_TO_PREMIUM"
      ? "PREMIUM"
      : userLoyalty?.level === "PREMIUM" ||
        userLoyalty?.level === "PROMOTED_TO_VIP"
      ? "VIP"
      : "LEGENDARY";
  };

  const handleCelebrationOk = async () => {
    setShowCelebration(false);
    if (restaurantIdNumber) {
      try {
        await promoteUserLoyalty(restaurantIdNumber);
        // Optionally, you can refetch user loyalty or coupons here if needed
        await refetchUserLoyalty();
        await refetchCoupons();
      } catch (error) {
        // Optionally handle error
      }
    }
  };

  const someChallengesReady =
    restaurantChallenges &&
    Object.entries(challengeScales).length === restaurantChallenges.length &&
    Object.entries(challengeScales).some(
      ([idx, val]) =>
        restaurantChallenges[idx] &&
        val >= restaurantChallenges[idx].visitsRequired
    );

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingBottom: 0 }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${configData?.backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.23,
          zIndex: 0,
          borderRadius: 20,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          minHeight: "100vh",
          background: darkColor,
          paddingBottom: 80,
          fontFamily: "'Montserrat', Arial, sans-serif",
        }}
      >
        {showCelebration &&
          (userLoyalty?.level === "PROMOTED_TO_PREMIUM" ||
            userLoyalty?.level === "PROMOTED_TO_VIP") && (
            <CelebrationModal
              level={userLoyalty.level}
              onOk={handleCelebrationOk}
            />
          )}
        <ReceiptsHeader
          configData={configData}
          goldTokens={userLoyalty?.availablePoints}
        />

        {/* Progress bar and tokens */}
        <div
          style={{ maxWidth: 480, padding: "0 16px 0 16px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "24px 0 16px 0",
            }}
          >
            {/* Linear scale */}
            <div style={{ flex: 1, marginRight: 16, position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#bbb",
                  marginBottom: 2,
                }}
              >
                <span>0</span>
                <span>{getCouponLimit(configData)}</span>
              </div>
              <div
                style={{
                  background: "#eee",
                  borderRadius: 8,
                  height: 14,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${
                      ((userLoyalty?.totalPoints ?? 0) /
                        getCouponLimit(configData)) *
                      100
                    }%`,
                    background: `linear-gradient(90deg, ${configData?.headerAndButtonColor} 60%, #ffe082 100%)`,
                    height: "100%",
                    borderRadius: 8,
                    transition: "width 0.3s",
                  }}
                />
                {/* Value marker */}
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${
                      ((userLoyalty?.totalPoints ?? 0) /
                        getCouponLimit(configData)) *
                      100
                    }% - 10px)`,
                    top: -8,
                    width: 28,
                    height: 28,
                    background: "#fff",
                    border: `2px solid ${configData?.headerAndButtonColor}`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#bfa16b",
                    boxShadow: "0 2px 8px rgba(191,161,107,0.10)",
                    zIndex: 2,
                  }}
                >
                  {userLoyalty?.totalPoints ?? 0}
                </div>
                {/* Info icon with tooltip */}
                <div
                  style={{
                    position: "absolute",
                    right: -32,
                    top: -6,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    zIndex: 3,
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <FaInfoCircle
                    style={{
                      color: configData?.headerAndButtonColor,
                      fontSize: 22,
                    }}
                    onClick={() => setShowTooltip(!showTooltip)}
                  />
                  {showTooltip && (
                    <div
                      style={{
                        position: "absolute",
                        top: 30,
                        right: 0,
                        background: "#fffbe6",
                        color: "#222",
                        border: "1px solid #bfa16b",
                        borderRadius: 8,
                        padding: "12px 16px",
                        fontSize: 14,
                        boxShadow: "0 2px 8px rgba(191,161,107,0.15)",
                        width: 280,
                        zIndex: 10,
                        fontWeight: 500,
                      }}
                    >
                      With {getCouponLimit(configData)} tokens you will become{" "}
                      <b>{getCouponNextLevel()}</b> member of Cross restaurant
                      and you will unlock additional coupons and benefits.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: 480, padding: 16 }}>
          <div style={{ display: "flex", marginBottom: 24 }}>
            <button
              onClick={() => setActiveTab("receipts")}
              style={{
                flex: 1,
                padding: 12,
                background:
                  activeTab === "receipts"
                    ? configData?.headerAndButtonColor
                    : "#eee",
                color:
                  activeTab === "receipts" ? "#fff" : configData?.fontColor,
                border: "none",
                borderRadius: "8px 0 0 8px",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Računi
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              style={{
                flex: 1,
                padding: 12,
                background:
                  activeTab === "coupons"
                    ? configData?.headerAndButtonColor
                    : "#eee",
                color: activeTab === "coupons" ? "#fff" : configData?.fontColor,
                border: "none",
                borderRadius: "0 8px 8px 0",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Kuponi
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "receipts" && (
            <>
              <h2
                style={{
                  color: accentColor,
                  fontWeight: 600,
                  fontSize: 24,
                  marginBottom: 24,
                  borderBottom: `2px solid ${configData?.headerAndButtonColor}`,
                  paddingBottom: 8,
                  letterSpacing: 1,
                }}
              >
                Vaši računi
              </h2>

              {receipts.length === 0 && (
                <div style={{ color: accentColor }}>
                  Nema pronađenih računa.
                </div>
              )}
              {receipts.map((receipt: any) => (
                <div
                  key={receipt.id}
                  style={{
                    background: accentColor,
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(191,161,107,0.10)",
                    marginBottom: 20,
                    padding: 20,
                    borderLeft: `6px solid ${configData?.headerAndButtonColor}`,
                    color: darkColor,
                    position: "relative",
                  }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 12, marginBottom: 8 }}
                  >
                    Račun #{receipt.receiptKey}
                  </div>
                  <div style={{ fontSize: 15, marginBottom: 4 }}>
                    <b>Iznos:</b> {receipt.amount} RSD
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 20,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* Main points */}
                    <div
                      style={{
                        background: configData?.headerAndButtonColor,
                        color: accentColor,
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 18,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                      }}
                      title="Broj poena"
                    >
                      {receipt.points ?? 0}
                    </div>
                    {/* Game points, if exist */}
                    {receipt.gamePoints ? (
                      <div
                        style={{
                          background: "#e53935",
                          color: "#fff",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 18,
                          marginLeft: 4,
                          boxShadow: "0 1px 4px rgba(229,57,53,0.10)",
                        }}
                        title="Game poeni"
                      >
                        +{receipt.gamePoints}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "coupons" && (
            <>
              <h2
                style={{
                  color: accentColor,
                  fontWeight: 600,
                  fontSize: 24,
                  marginBottom: 24,
                  borderBottom: `2px solid ${configData?.headerAndButtonColor}`,
                  paddingBottom: 8,
                  letterSpacing: 1,
                }}
              >
                Vaši kuponi
              </h2>
              {coupons.length === 0 && (
                <div style={{ color: accentColor }}>Nema dostupnih kupona.</div>
              )}
              {coupons.map((coupon: any) => (
                <div
                  key={coupon.id}
                  style={{
                    background: accentColor,
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(191,161,107,0.10)",
                    marginBottom: 20,
                    padding: 20,
                    borderLeft: `6px solid ${configData?.headerAndButtonColor}`,
                    color: darkColor,
                    position: "relative",
                  }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}
                  >
                    {coupon.name}
                  </div>
                  <div style={{ fontSize: 15, marginBottom: 4 }}>
                    <b>Potrebno poena:</b> {coupon.points}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowScanner(false)}
          >
            <div
              style={{ background: accentColor, padding: 24, borderRadius: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* <Scanner
              onScan={handleScan}
              scanDelay={100}
              constraints={{
                facingMode: "environment",
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              }}
              sound={false}
            /> */}
              <button
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "none",
                  background: configData?.headerAndButtonColor,
                  color: darkColor,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => setShowScanner(false)}
              >
                Zatvori
              </button>
            </div>
          </div>
        )}

        {/* Wheel Modal */}
        {showWheel && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowWheel(false)}
          >
            <div
              style={{
                background: accentColor,
                padding: 32,
                borderRadius: 16,
                minWidth: 220,
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  color: configData?.headerAndButtonColor,
                  marginBottom: 16,
                }}
              >
                Osvojili ste : {wheelData?.receiptPoints} poena
              </h2>
              <h2
                style={{
                  color: configData?.headerAndButtonColor,
                  marginBottom: 16,
                }}
              >
                Točak sreće
              </h2>
              <div
                style={{
                  border: `2px solid ${configData?.headerAndButtonColor}`,
                  borderRadius: 18,
                  background: "#f8f5ee",
                  padding: "24px 18px 18px 18px",
                  marginBottom: 32,
                  boxShadow: "0 2px 12px rgba(191,161,107,0.07)",
                  maxWidth: 400,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: darkColor,
                    marginBottom: 18,
                  }}
                >
                  Aktiviraj izazove
                </div>
                {/* Challenge sliders */}
                {restaurantChallenges &&
                  restaurantChallenges.map((challenge: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: 20 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 8,
                          color: darkColor,
                        }}
                      >
                        {challenge.period}-dnevni izazov:{" "}
                        {challenge.visitsRequired} poseta
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <input
                          type="range"
                          min={0}
                          max={challenge.visitsRequired}
                          value={challengeScales[idx] ?? 2}
                          onChange={(e) =>
                            setChallengeScales((cs) => ({
                              ...cs,
                              [idx]: Number(e.target.value),
                            }))
                          }
                          style={{ flex: 1 }}
                        />
                        <span
                          style={{
                            minWidth: 32,
                            fontWeight: 700,
                            color: configData?.headerAndButtonColor,
                          }}
                        >
                          {challengeScales[idx] ?? 2}
                        </span>
                        <span style={{ color: "#bbb", fontSize: 13 }}>
                          / {challenge.visitsRequired}
                        </span>
                      </div>
                    </div>
                  ))}
                <button
                  style={{
                    marginTop: 8,
                    padding: "12px 32px",
                    borderRadius: 8,
                    border: "none",
                    background: "#ccc",
                    color: accentColor,
                    fontWeight: 700,
                    fontSize: 18,
                    cursor: "not-allowed",
                    opacity: 0.7,
                    width: "100%",
                    boxShadow: undefined,
                    transition: "background 0.2s",
                  }}
                  disabled={true}
                >
                  Ostavi recenziju
                </button>
              </div>
              {wheelData && someChallengesReady && (
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={generateWheelData(wheelData.wheelData)}
                  backgroundColors={["#fff", "#bfa16b"]}
                  textColors={["#222"]}
                  onStopSpinning={handleWheelStop}
                  outerBorderColor={configData?.headerAndButtonColor}
                  outerBorderWidth={6}
                  radiusLineColor={darkColor}
                  radiusLineWidth={2}
                  fontSize={20}
                />
              )}

              {!mustSpin && pointsWon === null && (
                <button
                  style={{
                    marginTop: 24,
                    padding: "12px 32px",
                    borderRadius: 8,
                    border: "none",
                    background: someChallengesReady
                      ? configData?.headerAndButtonColor
                      : "#ccc",
                    color: accentColor,
                    fontWeight: 700,
                    fontSize: 18,
                    cursor: someChallengesReady ? "pointer" : "not-allowed",
                    opacity: someChallengesReady ? 1 : 0.7,
                  }}
                  onClick={handleStartWheel}
                  disabled={!someChallengesReady}
                >
                  Start
                </button>
              )}
              {pointsWon !== null && (
                <div
                  style={{
                    marginTop: 24,
                    fontSize: 22,
                    fontWeight: 700,
                    color: configData?.headerAndButtonColor,
                  }}
                >
                  Osvojili ste {pointsWon} poen{pointsWon === 1 ? "" : "a"}!
                </div>
              )}
              <button
                style={{
                  marginTop: 24,
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: darkColor,
                  color: accentColor,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => setShowWheel(false)}
              >
                Zatvori
              </button>
            </div>
          </div>
        )}

        {/* Fixed Scan Receipt Button */}
        <button
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            background: configData?.headerAndButtonColor,
            color: configData?.fontColor,
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
          onClick={() => fakeScanner()}
        >
          Skeniraj račun
        </button>
      </div>
    </div>
  );
};

export default ReceiptsPage;
