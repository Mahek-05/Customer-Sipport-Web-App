import axios from "axios";
import { useState } from "react";

export const useUpdateTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState();


  const updateTicket = async ({ id, status, agentId }) => {
    setLoading(true);
    setError(null);
    if (status === "unassigned") {
      agentId = null;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/customer-support/ticket/${id}`,
        { status, agentId }
      );
      console.log("Update ticket : ", response.data.data.ticket);
      const storedTicketData = localStorage.getItem("ticketData");
      if (storedTicketData) {
        const TicketData = JSON.parse(storedTicketData);
        if (TicketData) {
          console.log(TicketData.status);
          TicketData.status = status;
          localStorage.setItem("ticketData", JSON.stringify(TicketData));
        }
      }

      setData("Done");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { updateTicket, error, loading, data };
};
