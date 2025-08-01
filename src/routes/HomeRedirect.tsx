import React, { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const HomeRedirect: React.FC = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    const surveyCompleted = keycloak.tokenParsed?.surveyCompleted;

    if (surveyCompleted === "true") {
      navigate("/restaurants", { replace: true });
    } else {
      navigate("/survey", { replace: true });
    }
  }, [keycloak, navigate]);

  return null; // No visible UI; it's a redirect-only route
};

export default HomeRedirect;
