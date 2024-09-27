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
  {label: "Home", to: "/", icon: <FaHome className="text-blue-400 text-2xl" />},
  {
    label: "Receipts",
    to: "/receipts",
    icon: <FaReceipt className="text-green-400 text-2xl" />,
  },
  {
    label: "Transactions",
    to: "/transactions",
    icon: <FaMoneyCheckAlt className="text-yellow-400 text-2xl" />,
  },
  {
    label: "Subscriptions",
    to: "/subscriptions",
    icon: <FaReceipt className="text-purple-400 text-2xl" />,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: <FaCogs className="text-red-400 text-2xl" />,
  },
]

const Sidebar: React.FC = () => {
  return (
    <div className="min-h-screen w-16 bg-gray-900 text-white flex flex-col shadow-lg transition-all duration-300 md:w-48 lg:w-72">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center">
          <span>S</span>
          <span className="md:inline hidden">canify</span>
        </h1>
      </div>
      <nav className="flex-1 mt-10">
        <ul className="space-y-2">
          {links.map(link => (
            <li
              key={link.to}
              className="flex justify-center align-middle p-2 md:justify-normal hover:bg-gray-700"
            >
              <Link
                to={link.to}
                className="justify-center align-middle md:justify-normal flex items-center py-3 px-4 rounded-lg transition duration-200  group"
              >
                <span className="mr-3">{link.icon}</span>
                <span className="hidden md:block text-base group-hover:text-gray-300 w-64">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <li className="flex justify-center align-middle p-2 md:justify-normal hover:bg-gray-700 mt-auto">
          <LogoutButton />
        </li>
      </nav>
      <div className="p-6"></div>
    </div>
  )
}

export default Sidebar
