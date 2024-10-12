import { useState } from "react";
import { FaBell } from "react-icons/fa6";
import { Button } from "../ui/button";
import { IoMdCloseCircle } from "react-icons/io";

export default function Notify() {
  const [isOpen, setIsOpen] = useState(false);

  // Dummy notifications
  const notifications = [
    { id: 1, message: "Welcome to Branch International!" },
    { id: 2, message: "No new notifications" },
  ];

  // Toggle the dropdown visibility
  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <Button onClick={handleToggleDropdown}>
        {isOpen ? (
          <IoMdCloseCircle className="text-xl"/>
        ) : (
          <FaBell className="text-yellow-500 text-xl" />
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id} className="py-1 text-gray-700">
                    {notification.message}
                  </li>
                ))
              ) : (
                <li className="py-1 text-gray-500">No new notifications</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
