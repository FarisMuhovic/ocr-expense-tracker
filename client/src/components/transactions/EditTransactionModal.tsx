import {Button, Modal} from "flowbite-react"
import axios from "axios"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import ToastNotification from "../ToastNotification"

const API_URL = import.meta.env.VITE_API_URL

const EditTransactionModal = ({
  open,
  onClose,
  transactionId,
  fetchTransactions,
}: any) => {
  const [modalData, setModalData] = useState({
    name: "",
    price: 0,
    quantity: 1,
    category: "Miscellaneous",
    date: new Date().toISOString().split("T")[0],
  })
  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const [toastId, setToastId] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (transactionId) {
        const token = localStorage.getItem("jwt")
        if (!token) {
          navigate("/login")
          return
        }
        try {
          const response = await axios.get(
            `${API_URL}/transactions/${transactionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setModalData({
            name: response.data.name || "",
            price: response.data.price ?? 0,
            quantity: response.data.quantity ?? 1,
            category: response.data.category || "Miscellaneous",
            date: response.data.date || new Date().toISOString().split("T")[0], // Format date as YYYY-MM-DD
          })
        } catch (error: any) {
          console.error("Error fetching Transaction details:", error)
          if (error.response?.status === 401) {
            localStorage.removeItem("jwt")
            navigate("/login")
          }
        }
      }
    }

    fetchTransactionDetails()
  }, [transactionId])

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = localStorage.getItem("jwt")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      await axios.put(`${API_URL}/transactions/${transactionId}`, modalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchTransactions()
      onClose()
      addToast("success", "Transaction updated successfully!")
    } catch (error: any) {
      console.error("Error updating transaction:", error)
      addToast("error", "Error updating transaction. Please try again.")
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      }
    }
  }

  const addToast = (type: "success" | "error", message: string) => {
    const newToast = {
      id: toastId + 1,
      type,
      message,
    }

    setToasts(prev => [...prev, newToast])
    setToastId(prev => prev + 1)

    setTimeout(() => {
      removeToast(newToast.id)
    }, 3000)
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <>
      <Modal show={open} onClose={onClose}>
        <Modal.Header>Edit Transaction</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className="flex flex-col gap-4">
            <label className="block">
              <span className="text-gray-700">Transaction Name</span>
              <input
                type="text"
                name="name"
                id="name"
                value={modalData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Price</span>
              <input
                type="number"
                name="price"
                id="price"
                value={modalData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Quantity</span>
              <input
                type="number"
                name="quantity"
                id="quantity"
                value={modalData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Category</span>
              <select
                name="category"
                id="category"
                value={modalData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="Groceries">Groceries</option>
                <option value="Transportation">Transportation</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent/Mortgage">Rent/Mortgage</option>
                <option value="Insurance">Insurance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Dining Out">Dining Out</option>
                <option value="Clothing">Clothing</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Date</span>
              <input
                type="date"
                name="date"
                id="date"
                value={modalData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Update Transaction</Button>
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <div className="fixed bottom-5 right-5 z-[100]">
        {toasts.map(toast => (
          <ToastNotification
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            removeToast={removeToast}
          />
        ))}
      </div>
    </>
  )
}

export default EditTransactionModal
