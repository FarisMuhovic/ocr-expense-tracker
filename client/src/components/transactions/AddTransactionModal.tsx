import {Button, Modal} from "flowbite-react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {useState} from "react"
import ToastNotification from "../ToastNotification"

const API_URL = import.meta.env.VITE_API_URL

const AddTransactionModal = ({
  open,
  onClose,
  modalData,
  setModalData,
  setFetchTrigger,
}: any) => {
  const navigate = useNavigate()

  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const [toastId, setToastId] = useState(0)

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
    if (modalData.price <= 0) {
      addToast("error", "Pricing must be greater than 0.")
      return
    }
    try {
      await axios.post(`${API_URL}/transactions`, modalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setTimeout(() => {
        onClose()
        setModalData({
          date: new Date().toISOString().split('T')[0], 
          name: "",
          price: 0,
          quantity: 1,
          category: "Miscellaneous",
        })
        addToast("success", "Transaction created successfully!")
        setFetchTrigger((prev: any) => !prev)
      }, 300)
    } catch (error: any) {
      addToast("error", "Error creating transaction. Please try again.")
      if (error.response.status === 401) {
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
        <Modal.Header>Add Transaction</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 py-1 ">
              <span>Transaction Name</span>
              <input
                type="text"
                name="name"
                id="name"
                minLength={3}
                maxLength={99}
                placeholder="Dentist appointment"
                required
                value={modalData.name}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-2 py-1 ">
              <span>Pricing</span>
              <input
                type="number"
                name="price"
                id="price"
                placeholder="9.99"
                min={0}
                step={0.01}
                max={9999}
                required
                value={modalData.price === 0 ? "" : modalData.price}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-2 py-1">
              <span>Quantity</span>
              <input
                type="number"
                name="quantity"
                id="quantity"
                placeholder="1"
                min={1}
                max={99}
                required
                value={modalData.quantity}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-2 py-1 ">
              <span>Date</span>
              <input
                type="date"
                name="date"
                id="date"
                required
                value={modalData.date}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-2 py-1">
              <span>Category</span>
              <select
                name="category"
                id="category"
                required
                value={modalData.category}
                onChange={handleInputChange}
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
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Add Transaction</Button>
            <Button color="gray" onClick={onClose} type="button">
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

export default AddTransactionModal
