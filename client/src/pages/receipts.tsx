import React from "react"
import OCRComponent from "../components/receipts/OCRcomponent"

const Receipts: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Receipts - Scan or upload your receipts here
        </h1>
        <OCRComponent />
      </div>
    </div>
  )
}

export default Receipts
