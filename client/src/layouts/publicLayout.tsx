import React, {useEffect, useState} from "react"
import {Navigate, Outlet} from "react-router-dom"

const PublicLayout: React.FC = () => {
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
    return <div>Loading...</div> // Or a spinner
  }

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />
}

export default PublicLayout
