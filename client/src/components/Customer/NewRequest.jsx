import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import useRaiseTicket from "@/hooks/raiseTicket";
import { useNavigate } from "react-router-dom";

export function NewRequest() {
  const [selectedProblem, setSelectedProblem] = useState('');
  const [otherProblem, setOtherProblem] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const { raiseTicket, data, loading, error } = useRaiseTicket();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('UserData'));
    if (storedUserData && storedUserData.role) {
      setUserData(storedUserData);
    }
  }, []);

  const problems = [
    'Network Error',
    'Error in Payment',
    'Delivery Date',
    'Others',
  ];

  const handleProblemChange = (event) => {
    setSelectedProblem(event.target.value);
    if (event.target.value !== 'Others') {
      setOtherProblem('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const issueTitle = selectedProblem === 'Others' ? otherProblem : selectedProblem;
    const username = userData?.customer?.username || "Unknown User"; // Fallback if username is not available

    const requestData = {
      issueTitle,
      username,
    };

    console.log(requestData);

    try {
      await raiseTicket(requestData);
      setSelectedProblem('');
      setOtherProblem('');
    } catch (error) {
      console.error(error);
    }
  };

  // Use useEffect to navigate after data is updated
  useEffect(() => {
    if (data && data._id) {
      console.log("Navigating to chat:", data._id);
      navigate(`/customer/ticket/${data._id}`);
    }
  }, [data, navigate]); // Add `navigate` as a dependency to avoid linting issues

  return (
    <div className="p-4 bg-white rounded-lg w-[50%] shadow-md">
      <h2 className="text-lg font-semibold mb-4">New Request</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="problem" className="block mb-2 font-medium">Select a Problem:</label>
          <select
            id="problem"
            value={selectedProblem}
            onChange={handleProblemChange}
            className="border rounded-lg p-2 w-full"
          >
            <option value="">-- Select a Problem --</option>
            {problems.map((problem, index) => (
              <option key={index} value={problem}>
                {problem}
              </option>
            ))}
          </select>
        </div>

        {selectedProblem === 'Others' && (
          <div className="mb-4">
            <label htmlFor="otherProblem" className="block mb-2 font-medium">Please specify:</label>
            <Textarea
              type="text"
              id="otherProblem"
              value={otherProblem}
              onChange={(e) => setOtherProblem(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedProblem || (selectedProblem === 'Others' && !otherProblem)}
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading || !selectedProblem || (selectedProblem === 'Others' && !otherProblem) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>

        {error && <div className="text-red-500 mt-4">Error: {error}</div>}
      </form>
    </div>
  );
}
