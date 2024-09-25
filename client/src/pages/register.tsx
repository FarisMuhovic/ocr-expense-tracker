import {useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {Toast} from "flowbite-react"
import {HiCheck, HiExclamation} from "react-icons/hi"
import FormData from "../interfaces/registerFormData"

const API_URL = import.meta.env.VITE_API_URL

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const [idCounter, setIdCounter] = useState(0)

  const addToast = (type: "success" | "error", message: string) => {
    const newToast = {id: idCounter, type, message}
    setToasts(prev => [...prev, newToast])
    setIdCounter(prev => prev + 1)

    // Automatically remove the toast after a certain duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, 3000) // Toast duration (3 seconds)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      addToast("error", "Passwords do not match!")
      return
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData)
      localStorage.setItem("jwt", response.data.token)
      addToast("success", "Registration successful!")
      navigate("/")
    } catch (error: any) {
      addToast(
        "error",
        error.response?.data?.message || "Internal Server Error"
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-0 right-0 p-4 space-y-2 z-50 min-w-80">
        {toasts.map(toast => (
          <Toast key={toast.id}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              {toast.type === "success" ? (
                <HiCheck className="h-5 w-5" />
              ) : (
                <HiExclamation className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
            <Toast.Toggle />
          </Toast>
        ))}
      </div>
    </div>
  )
}

export default Register
