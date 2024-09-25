import React, {useEffect, useState} from "react"
import {Navigate, Outlet} from "react-router-dom"
import Loader from "../components/Spinner"

const ProtectedLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("jwt")
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  if (isAuthenticated === null) {
    return <Loader />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedLayout
