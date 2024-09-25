import {useState, useEffect} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom" // Import navigate if needed
import ToastNotification from "../components/ToastNotification"

const API_URL = import.meta.env.VITE_API_URL

const Settings: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  })
  const [currency, setCurrency] = useState("EUR")
  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const navigate = useNavigate() // Use navigate to redirect

  useEffect(() => {
    fetchProfile()
  }, [])

  const addToast = (type: "success" | "error", message: string) => {
    const id = new Date().getTime() // Simple ID generation
    setToasts(prev => [...prev, {id, type, message}])
    setTimeout(() => removeToast(id), 3000) // Automatically remove toast after 3 seconds
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const fetchProfile = async () => {
    const token = localStorage.getItem("jwt")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      setProfile(prev => ({
        firstName: response.data.firstName || prev.firstName,
        lastName: response.data.lastName || prev.lastName,
        email: response.data.email || prev.email,
      }))
      setCurrency(response.data.currency)
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      } else {
        console.error("Error fetching profile:", error)
        addToast("error", "Error fetching profile. Please try again.")
      }
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setProfile(prev => ({...prev, [name]: value}))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setPasswords(prev => ({...prev, [name]: value}))
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("jwt")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      await axios.put(`${API_URL}/users/profile/`, profile, {
        headers: {Authorization: `Bearer ${token}`},
      })
      addToast("success", "Profile updated successfully!")
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      } else {
        console.error("Error updating profile:", error)
        addToast("error", "Error updating profile. Please try again.")
      }
    }
  }

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("jwt")
    if (passwords.newPassword !== passwords.repeatNewPassword) {
      addToast("error", "New passwords do not match!")
      return
    }
    if (!token) {
      navigate("/login")
      return
    }
    try {
      await axios.post(`${API_URL}/users/change-password`, passwords, {
        headers: {Authorization: `Bearer ${token}`},
      })
      addToast("success", "Password changed successfully!")
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      } else {
        console.error("Error updating password:", error)
        addToast("error", "Error updating password. Please try again.")
      }
    }
  }

  const changeCurrency = async (currency: string) => {
    setCurrency(currency)
    const token = localStorage.getItem("jwt")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      await axios.put(
        `${API_URL}/users/currency/`,
        {currency},
        {headers: {Authorization: `Bearer ${token}`}}
      )
      addToast("success", "Currency updated successfully!")
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      } else {
        console.error("Error updating currency:", error)
        addToast("error", "Error updating currency. Please try again.")
      }
    }
  }

  return (
    <div className="flex">
      <div className="flex-1 p-10">
        <h4 className="text-xl font-semibold mb-4">
          Settings - Manage your account settings here
        </h4>
        <hr />
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <label className="block">
              <span className="font-medium">First Name</span>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block">
              <span className="font-medium">Last Name</span>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block">
              <span className="font-medium">Email</span>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-200"
              />
            </label>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Save Changes
            </button>
          </form>
        </div>
        <hr />
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <label className="block">
              <span className="font-medium">Current Password:</span>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block">
              <span className="font-medium">New Password:</span>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block">
              <span className="font-medium">Repeat New Password:</span>
              <input
                type="password"
                name="repeatNewPassword"
                value={passwords.repeatNewPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Change Password
            </button>
          </form>
        </div>
        <hr />
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center space-x-4">
            <label htmlFor="currency" className="font-medium">
              Currency:
            </label>
            <select
              id="currency"
              value={currency}
              onChange={e => changeCurrency(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="KM">KM</option>
              <option value="EUR">Euro</option>
              <option value="USD">Dollar</option>
            </select>
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-0 p-6">
        {toasts.map(toast => (
          <ToastNotification
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            removeToast={removeToast}
          />
        ))}
      </div>
    </div>
  )
}

export default Settings
