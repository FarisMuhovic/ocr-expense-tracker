import React from "react"

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1 p-10 text-gray-900">
        <h1 className="text-3xl font-bold">Home (Dashboard)</h1>
        <p className="mt-4">
          Welcome to the dashboard! Here you can manage your settings,
          subscriptions, and transactions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* You can add more details here */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-2">Here's a summary of your account activity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
