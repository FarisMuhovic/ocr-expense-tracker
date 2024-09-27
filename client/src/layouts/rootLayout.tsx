import React from "react"
import {Outlet} from "react-router-dom"
import Sidebar from "../components/Sidebar"

const RootLayout: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-0 py-2 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
