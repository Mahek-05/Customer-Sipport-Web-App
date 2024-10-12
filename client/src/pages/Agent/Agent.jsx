import Chat from "@/components/Agent/Chat";
import CustomerInfo from "@/components/Agent/CustomerInfo";
import Notify from "@/components/Agent/Notify";
import RequestTab from "@/components/Agent/RequestTab";
import SideBar from "@/components/Agent/SideBar";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { id } = useParams(); // Fetching chat ID from URL params
  const userData = JSON.parse(localStorage.getItem('UserData'));

  useEffect(() => {
    // Check if user is logged in and has the correct role
    if (!userData || userData.role !== 'agent') {
      navigate('/auth/agent/login');
    }
  }, [navigate, userData, userData.role]);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-Roboto my-1 font-semibold text-[#19355e] text-center">
          Agent Panel
        </h1>
      </div>
      <div className="flex">
        <SideBar />
        <div className="flex flex-col w-full">
          <div className="flex justify-between">
            <RequestTab userData={userData}/>
            <div className="flex items-center gap-2">
              <CustomerInfo />
              <Notify />
            </div>
          </div>
          {id ? (
            <Chat userData={userData} /> 
          ) : (
            <div className="text-center my-4">Select a chat to start messaging.</div>
          )}
        </div>
      </div>
    </div>
  );
}
