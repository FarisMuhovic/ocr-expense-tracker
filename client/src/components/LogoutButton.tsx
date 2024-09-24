import React from "react"
import {useNavigate} from "react-router-dom"
import {FaSignOutAlt} from "react-icons/fa"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const LogoutButton: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const token = localStorage.getItem("jwt")
    if (!token) {
      console.error("No token found")
      return
    }

    try {
      // Send the logout request to the backend
      await axios.post(
        `${API_URL}/auth/logout`, // Update the endpoint to match your backend route
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in Authorization header
          },
        }
      )

      // Remove the token from localStorage after successful logout
      localStorage.removeItem("jwt")
      navigate("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center py-2.5 px-4 bg-red-600 rounded text-center transition duration-200 hover:bg-red-700"
    >
      <FaSignOutAlt className="mr-3 text-xl text-white" />
      Log Out
    </button>
  )
}

export default LogoutButton
