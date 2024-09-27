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
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      localStorage.removeItem("jwt")
      navigate("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className=" flex items-center justify-center py-2.5 px-4 rounded text-center transition duration-200 "
    >
      <FaSignOutAlt className="mr-2 text-2xl text-red-500" />
      <span className="hidden md:inline min-w-16">Log Out</span>
    </button>
  )
}

export default LogoutButton
