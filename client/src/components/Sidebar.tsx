import React from "react"
import {Link} from "react-router-dom"
import {FaHome, FaMoneyCheckAlt, FaReceipt, FaCogs} from "react-icons/fa"
import LogoutButton from "./LogoutButton"

interface SidebarLink {
  label: string
  to: string
  icon: JSX.Element
}

const links: SidebarLink[] = [
  {label: "Home", to: "/", icon: <FaHome className="text-xl text-blue-400" />},
  {
    label: "Transactions",
    to: "/transactions",
    icon: <FaMoneyCheckAlt className="text-xl text-green-400" />,
  },
  {
    label: "Subscriptions",
    to: "/subscriptions",
    icon: <FaReceipt className="text-xl text-yellow-400" />,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: <FaCogs className="text-xl text-purple-400" />,
  },
]

const Sidebar: React.FC = () => {
  return (
    <div className="min-h-screen w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center">Dashboard</h1>
        </div>
        <nav className="mt-10">
          <ul className="space-y-2">
            {links.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-6">
        <LogoutButton />
      </div>
    </div>
  )
}

export default Sidebar
