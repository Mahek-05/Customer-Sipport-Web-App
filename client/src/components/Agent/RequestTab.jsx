/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useGetResolvedTickets, useGetAssignedTickets, useGetUnassignedTickets } from "./../../hooks/getTickets";
import { useUpdateTicket } from "@/hooks/updateTicket";

function Modal({ title, data, onClose }) {
  const navigate = useNavigate();
  console.log('Data ==> ' + data)

  const redirectHandler = (request) => {
    console.log('Ticket ==> ', request)
    localStorage.setItem('ticketData', JSON.stringify(request))
    navigate(`/agent/ticket/${request._id}`);
    onClose(); // Close modal when redirecting
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-xl mb-4">{title}</h2>
        <div className="mb-6">
          {data.length > 0 ? (
            <ul>
              {data.map((request) => (
                <div
                  key={request._id}
                  className="flex gap-2 justify-between w-full bg-[#d1d5db] px-2 py-1 rounded m-1"
                >
                  <li>
                    <strong>Title:</strong> {request.issueTitle} <br />
                    <strong>Username:</strong> {request.username} <br />
                    <strong>Status:</strong> {request.status} <br />
                    <strong>ID:</strong> {request._id}
                  </li>
                  <Button
                    onClick={() => redirectHandler(request)}
                    className="text-blue-500 font-semibold"
                  >
                    View Chat
                  </Button>
                </div>
              ))}
            </ul>
          ) : (
            <p>No requests available for this status.</p>
          )}
        </div>
        <Button
          onClick={onClose}
          className="bg-red-500 text-white rounded hover:bg-red-500 absolute top-2 right-2"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default function RequestTab({ userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", data: [] });
  const [currentStatus, setCurrentStatus] = useState("");

  // Load ticket data from local storage once when component mounts
  useEffect(() => {
    const storedTicketData = localStorage.getItem("ticketData");
    if (storedTicketData) {
      const ticketData = JSON.parse(storedTicketData);
      setCurrentStatus(ticketData.status || "");
    }
  }, []); // Only run this once when the component mounts

  const { getAssignedTickets, loading: loadingAssigned, data: assignedTickets } = useGetAssignedTickets();
  const { getUnassignedTickets, loading: loadingUnassigned, data: unassignedTickets } = useGetUnassignedTickets();
  const { getResolvedTickets, loading: loadingResolved, data: resolvedTickets } = useGetResolvedTickets();
  const { updateTicket } = useUpdateTicket();

  const handleOpenModal = async (type) => {
    setCurrentStatus(type);
    setIsOpen(true);

    if (type === "assigned") {
      await getAssignedTickets({});
    } else if (type === "unassigned") {
      await getUnassignedTickets({});
    } else if (type === "resolved") {
      await getResolvedTickets({});
    }
  };

  useEffect(() => {
    let ticketsData = [];

    if (currentStatus === "assigned") {
      ticketsData = assignedTickets;
    } else if (currentStatus === "unassigned") {
      ticketsData = unassignedTickets;
    } else if (currentStatus === "resolved") {
      ticketsData = resolvedTickets;
    }

    setModalContent({
      title: `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Requests`,
      data: ticketsData,
    });
  }, [assignedTickets, unassignedTickets, resolvedTickets, currentStatus]);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const { id } = useParams();

  const updateStatusRequest = (status) => {
    if (!status) return;
    updateTicket({ status, id, agentId: userData.agent.agentId });
    
    // Update local storage when status changes
    const storedTicketData = localStorage.getItem('ticketData');
    if (storedTicketData) {
      const ticketData = JSON.parse(storedTicketData);
      ticketData.status = status; // Update status in local storage data
      localStorage.setItem('ticketData', JSON.stringify(ticketData)); // Save back to local storage
    }

    // Update the state to reflect the new status immediately
    setCurrentStatus(status);
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => handleOpenModal("assigned")}
        className="bg-[#3eabd6] rounded text-[#19355e] text-lg border-2 border-[#19355e]"
      >
        Assigned Request
      </Button>
      <Button
        onClick={() => handleOpenModal("unassigned")}
        className="bg-[#3eabd6] rounded text-[#19355e] text-lg border-2 border-[#19355e]"
      >
        Unassigned Request
      </Button>
      <Button
        onClick={() => handleOpenModal("resolved")}
        className="bg-[#3eabd6] rounded text-[#19355e] text-lg border-2 border-[#19355e]"
      >
        Resolved Request
      </Button>
      <div className="flex items-center gap-2">
        <span>Status :</span>
        <select
          name="status"
          id="status"
          onChange={(e) => updateStatusRequest(e.target.value)}
          value={currentStatus}
        >
          <option value="">Select Status</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {isOpen && (
        <Modal
          title={modalContent.title}
          data={modalContent.data}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
