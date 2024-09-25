import {useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {Toast} from "flowbite-react"
import {HiCheck, HiExclamation} from "react-icons/hi"
import FormData from "../interfaces/loginFormData"

const API_URL = import.meta.env.VITE_API_URL

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const [idCounter, setIdCounter] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const addToast = (type: "success" | "error", message: string) => {
    const newToast = {id: idCounter, type, message}
    setToasts(prev => [...prev, newToast])
    setIdCounter(prev => prev + 1)

    // Automatically remove the toast after a certain duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, 3000) // Toast duration (3 seconds)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData)
      localStorage.setItem("jwt", response.data.token)
      addToast("success", "Login successful!")
      navigate("/")
    } catch (error: any) {
      addToast("error", error.response?.data?.message || "Internal Server Error!")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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
              minLength={5}
              maxLength={350}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                minLength={5}
                maxLength={50}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="mr-2 h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="text-sm">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/register" className="text-blue-500 hover:underline">
            Don't have an account? Register
          </a>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-0 right-0 p-4 space-y-2 z-50 min-w-80 ">
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

export default Login
