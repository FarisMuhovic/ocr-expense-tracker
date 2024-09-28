import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom" // Use this with React Router
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [numTransactions, setNumTransactions] = useState<number>(0)
  const [numSubscriptions, setNumSubscriptions] = useState<number>(0)
  const navigate = useNavigate()

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("jwt")
      if (!token) {
        navigate("/login")
        return
      }
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTransactions(response.data)
    } catch (error: any) {
      console.error("Error fetching transactions:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      }
    }
  }

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("jwt")
      if (!token) {
        navigate("/login")
        return
      }
      const response = await axios.get(`${API_URL}/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSubscriptions(response.data)
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      }
    }
  }

  const loadData = async () => {
    let total: any = 0
    subscriptions.forEach(subscription => {
      total += subscription.pricing
    })
    transactions.forEach(transaction => {
      console.log(transaction)
      total += transaction.price
    })
    setTotalPrice(total)

    setNumTransactions(transactions.length)
    setNumSubscriptions(subscriptions.length)
  }
  useEffect(() => {
    fetchTransactions()
    fetchSubscriptions()
  }, [])
  useEffect(() => {
    loadData()
  }, [transactions, subscriptions])
  return (
    <div className="flex flex-col">
      <div className="flex-1 p-10 text-gray-900">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4">
          Welcome to the dashboard! Manage your settings, subscriptions, and
          transactions here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-green-100 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-green-800">
              Transactions
            </h2>
            <p className="mt-4 text-4xl font-bold text-green-900">
              {numTransactions}
            </p>
            <p className="mt-2 text-green-600">Total Transactions</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-blue-800">
              Subscriptions
            </h2>
            <p className="mt-4 text-4xl font-bold text-blue-900">
              {numSubscriptions}
            </p>
            <p className="mt-2 text-blue-600">Active Subscriptions</p>
          </div>

          <div className="bg-pink-100 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-pink-800">Total Price</h2>
            <p className="mt-4 text-4xl font-bold text-pink-900">
              ${totalPrice}
            </p>
            <p className="mt-2 text-pink-600">Total Amount Spent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Scan Receipt</h2>
            <p className="mt-2">
              Upload a receipt and view it in the Receipts section.
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/receipts")}
            >
              Go to Receipts
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Transactions</h2>
            <p className="mt-2">View and manage your transactions.</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/transactions")}
            >
              View Transactions
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Subscriptions</h2>
            <p className="mt-2">
              Manage your subscriptions and see upcoming payments.
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/subscriptions")}
            >
              View Subscriptions
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="mt-2">
              Manage your account preferences and security settings.
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/settings")}
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
