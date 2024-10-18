import { useNavigate, useParams } from "react-router-dom";
import History from "@/components/Customer/History";
import {NewRequest} from "@/components/Customer/NewRequest";
import {Chat} from "@/components/Customer/Chat"; 
import { useEffect, useState } from "react";

export function Customer() {
  const navigate = useNavigate();
  const {id} = useParams();
  console.log("id in Customer page:", id);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const storedUserDataString = localStorage.getItem('UserData');  
    const storedUserData = JSON.parse(storedUserDataString);
    setUserData(storedUserData);

    if (!storedUserData || storedUserData.role !== 'customer') {
      navigate('/auth/customer/login');
    }
  }, [navigate]);

  if (!userData) {
    return null; 
  }

  return (
    <div className="flex w-full">
      <div className="m-1 h-full">
        <History />
      </div>
      <div className="flex items-center justify-center w-[70vw] h-[70vh]">
        {id ? <Chat userData={userData} ticketId={id}/> : <NewRequest /> }
      </div>
    </div>
  );
}
