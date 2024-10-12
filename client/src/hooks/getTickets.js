import axios from "axios";
import { useCallback, useState } from "react";

// Hook for fetching assigned tickets
export const useGetAssignedTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const getAssignedTickets =useCallback( async ({ username, agentId, searchText }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customer-support/ticket`, {
        params: {
          username,
          agentId,
          status: "assigned",
          searchText
        }
      });
      console.log('Fetched assigned tickets', response.data.data.tickets);
      setData(response.data.data.tickets || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  },[]);

  return { getAssignedTickets, loading, error, data };
};

// Hook for fetching unassigned tickets
export const useGetUnassignedTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const getUnassignedTickets = async ({ username, agentId, searchText }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customer-support/ticket`, {
        params: {
          username,
          agentId,
          status: "unassigned",
          searchText
        }
      });
      console.log('Fetched unassigned tickets', response.data.data.tickets);
      setData(response.data.data.tickets || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { getUnassignedTickets, loading, error, data };
};

// Hook for fetching resolved tickets
export const useGetResolvedTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const getResolvedTickets = async ({ username, agentId, searchText }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customer-support/ticket`, {
        params: {
          username,
          agentId,
          status: "resolved",
          searchText
        }
      });
      console.log('Fetched resolved tickets', response.data.data.tickets);
      setData(response.data.data.tickets || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { getResolvedTickets, loading, error, data };
};
    