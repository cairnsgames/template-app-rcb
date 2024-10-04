import { useState, useEffect, useCallback } from "react";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import useUser from "../../../packages/auth/context/useuser";
import useTenant from "../../../packages/tenant/context/usetenant";
import useToast from "../../../packages/toasts/usetoast";
import eventing from "../../../packages/eventing/eventing";

export const usePartnerRoles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [roles, setRoles] = useState([]);
  const { user, token } = useUser();
  const { tenant } = useTenant();

  const { addToast } = useToast();

  const headers = {
    "Content-Type": "application/json",
    APP_ID: tenant,
    token: token,
  };
  const [roleList] = useState([
    { id: 26, name: "Teacher" },
    { id: 27, name: "DJ" },
    { id: 28, name: "Venue" },
    { id: 29, name: "Event Coordinator" },
    { id: 30, name: "Supplier" },
  ]);

  if (!process.env.REACT_APP_PARTNER_API) {
    console.error("REACT_APP_PARTNER_API environment variable is not set");
  }

  const updatePartnerRoles = useCallback(async (roles, payments) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const url = combineUrlAndPath(
      process.env.REACT_APP_PARTNER_API,
      "partners.php"
    ); // Replace with the actual path to your PHP script

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
  }, [token, tenant]);

  const fetchUserRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    const url = combineUrlAndPath(
      process.env.REACT_APP_PARTNER_API,
      "getroles.php"
    ); // Replace with the actual path to your PHP script

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
    }
  }, [token, tenant]);

  return {
    updatePartnerRoles,
    fetchUserRoles,
    loading,
    error,
    success,
    roles,
    roleList,
  };
}

export default usePartnerRoles;
