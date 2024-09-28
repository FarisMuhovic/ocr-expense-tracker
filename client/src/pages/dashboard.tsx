import React, {useEffect, useState} from "react"

// Mock API call to fetch data
const fetchTransactions = async () => {
  return [
    {id: 1, name: "Transaction 1", amount: "$20", date: "2024-09-25"},
    {id: 2, name: "Transaction 2", amount: "$50", date: "2024-09-20"},
    {id: 3, name: "Transaction 3", amount: "$75", date: "2024-09-18"},
  ]
}

const fetchSubscriptions = async () => {
  return [
    {id: 1, name: "Service A", status: "Active", nextPayment: "2024-10-01"},
    {id: 2, name: "Service B", status: "Inactive", nextPayment: "N/A"},
  ]
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])

  useEffect(() => {
    // Fetch transactions and subscriptions from API (mock)
    const loadData = async () => {
      const trans = await fetchTransactions()
      const subs = await fetchSubscriptions()
      setTransactions(trans)
      setSubscriptions(subs)
    }

    loadData()
  }, [])

  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1 p-10 text-gray-900">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4">
          Welcome to the dashboard! Manage your settings, subscriptions, and
          transactions here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Settings Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="mt-2">
              Manage your account preferences and security settings.
            </p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
