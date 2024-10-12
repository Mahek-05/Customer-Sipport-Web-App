import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function useLoginHook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const login = async ({ role, username }) => {
    console.log(`login ${role} ${username}`);

    setLoading(true);
    setError(null);

    try {
      let response
      if(role === "agent") {
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customer-support/${role}/login`, { agentId:username });
      }
      else {
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customer-support/${role}/login`, { username });
      }
      
      const userData = {
        ...response.data.data, 
        role, 
      };
      console.log('Login successful:', userData);
      localStorage.setItem('UserData', JSON.stringify(userData));
      
      setData({
        message: 'Login successful',
        user: userData,
      });
      
      navigate(`/${role}`);
    } catch (error) {
      setError(error.response ? error.response.data : 'An error occurred');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, data };
}
