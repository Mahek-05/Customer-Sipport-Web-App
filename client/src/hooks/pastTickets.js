import axios from "axios";
import { useState, useCallback } from "react";

export const usePastTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // Use useCallback to memoize pastTickets and prevent it from being redefined on every render
  const pastTickets = useCallback(async ({ username, agentId, status, searchText }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customer-support/ticket`, {
        params: {
          username,
          agentId,
          status: status !== null ? status : null,
          searchText
        }
      });
      setData(response.data.data.tickets);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false); // Make sure loading is set to false even after an error
    }
  }, []); // No dependencies because you don't rely on any external variables

  return { pastTickets, loading, error, data };
};
