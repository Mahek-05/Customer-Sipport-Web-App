import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function useRegisterHook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const register = async ({ role, firstName, lastName, email, username, agentId }) => {
    console.log(`register ${role} ${username || agentId}`);

    setLoading(true);
    setError(null);

    try {
      let response;
      if (role === "agent") {
        response = await axios.post(`http://localhost:3000/customer-support/${role}/register`, {
          firstName,
          lastName,
          email,
          agentId,
        });
      } else {
        response = await axios.post(`http://localhost:3000/customer-support/${role}/register`, {
          firstName,
          lastName,
          email,
          username,
        });
      }
      const registeredData = {
        ...response.data.data,
        role,
      };
      console.log('Registration successful:', registeredData);
      localStorage.setItem('UserData', JSON.stringify(registeredData));
      setData({
        message: 'Registration successful',
        user: registeredData,
      });
      navigate(`/${role}`);
    } catch (error) {
      setError(error.response ? error.response.data : 'An error occurred');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, data };
}
