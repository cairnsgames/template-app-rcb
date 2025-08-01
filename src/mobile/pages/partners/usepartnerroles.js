import { useState, useEffect, useCallback } from "react";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import useUser from "../../../packages/auth/context/useuser";
import useTenant from "../../../packages/tenant/context/usetenant";
import useToast from "../../../packages/toasts/usetoast";
import eventing from "../../../packages/eventing/eventing";
import { useTranslation } from "react-i18next";

export const usePartnerRoles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [roles, setRoles] = useState([]);
  const [bankingDetails, setBankingDetails] = useState(null);

  const { user, token } = useUser();
  const { tenant } = useTenant();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const headers = {
    "Content-Type": "application/json",
    APP_ID: tenant,
    token: token,
  };

  const [roleList] = useState([
    { id: 26, name: t("roles.teacher") },
    { id: 27, name: t("roles.dj") },
    { id: 28, name: t("roles.venue") },
    { id: 29, name: t("roles.eventCoordinator") },
    { id: 30, name: t("roles.supplier") },
  ]);

  if (!process.env.REACT_APP_PARTNER_API) {
    console.error("REACT_APP_PARTNER_API environment variable is not set");
  }

  const fetchPartnerBankingDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    const bankingUrl = combineUrlAndPath(
      process.env.REACT_APP_PARTNER_API,
      `api.php/partner/${user.id}/banking`
    );

    try {
      const response = await fetch(bankingUrl, { headers });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      if (Array.isArray(result) && result.length > 0) {
        setBankingDetails(result[0]);
      } else {
        setBankingDetails(result);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching banking details:", error);
    } finally {
      setLoading(false);
    }
  }, [token, tenant, user.id]);

  const updatePartnerRoles = useCallback(
    async (roles, payments) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const url = combineUrlAndPath(
        process.env.REACT_APP_PARTNER_API,
        "partners.php"
      );

      const payload = {
        role: roles,
        payments: payments,
      };

      const bankingUrl = combineUrlAndPath(
        process.env.REACT_APP_PARTNER_API,
        "api.php/banking"
      );

      fetch(bankingUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload.payments),
      });

      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        setSuccess(result);
        addToast("Partner", "Partner status updated", "success");
        eventing.publish("permissions", "reload", payload);
      } catch (error) {
        setError(error.message);
        console.error("Error updating roles:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, tenant]
  );

  const fetchUserRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    const url = combineUrlAndPath(
      process.env.REACT_APP_PARTNER_API,
      "getroles.php"
    );

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      setRoles(result);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  }, [token, tenant]);

  useEffect(() => {
    if (token && tenant) {
      fetchUserRoles();
      fetchPartnerBankingDetails();
    }
  }, [token, tenant]);

  return {
    updatePartnerRoles,
    fetchUserRoles,
    fetchPartnerBankingDetails,
    loading,
    error,
    success,
    roles,
    roleList,
    bankingDetails,
  };
};

export default usePartnerRoles;
