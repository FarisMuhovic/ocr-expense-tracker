import React, {useEffect, useState} from "react"
import {Navigate, Outlet} from "react-router-dom"

const ProtectedLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Simulate token fetch or verification process
    const token = localStorage.getItem("jwt") // Or wherever you store it

    if (token) {
      // Validate token through an API call or just assume it's valid
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(true)
    }
  }, [])

  if (isAuthenticated === null) {
    return <div>Loading...</div> // Or a spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedLayout
