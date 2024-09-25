import {Button, Modal} from "flowbite-react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {useState} from "react"
import ToastNotification from "../ToastNotification"

const API_URL = import.meta.env.VITE_API_URL

const AddSubscriptionModal = ({
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
    if (modalData.pricing <= 0) {
      addToast("error", "Pricing must be greater than 0.")
      return
    }
    try {
      await axios.post(`${API_URL}/subscriptions`, modalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setTimeout(() => {
        onClose()
        setModalData({
          name: "",
          pricing: 0,
          billingCycle: "Monthly",
          notes: "",
        })
        addToast("success", "Subscription created successfully!")
        setFetchTrigger((prev: any) => !prev)
      }, 300)
    } catch (error: any) {
      addToast("error", "Error creating subscription. Please try again.")
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
        <Modal.Header>Add Subscription</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 py-1 ">
              <span>Subscription Name</span>
              <input
                type="text"
                name="name"
                id="name"
                minLength={3}
                maxLength={99}
                placeholder="Netflix"
                required
                value={modalData.name}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-2 py-1 ">
              <span>Pricing</span>
              <input
                type="number"
                name="pricing"
                id="pricing"
                placeholder="9.99"
                min={0}
                step={0.01}
                max={9999}
                required
                value={modalData.pricing === 0 ? "" : modalData.pricing}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-2 py-1 ">
              <span>Billing cycle</span>
              <select
                id="billingCycle"
                name="billingCycle"
                required
                value={modalData.billingCycle}
                onChange={handleInputChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semiannual">Semiannual</option>
                <option value="Annual">Annual</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 py-1 ">
              <span>Note (optional)</span>
              <input
                type="text"
                name="notes"
                id="notes"
                placeholder="Add any additional details or specific instructions regarding this subscription."
                minLength={10}
                maxLength={512}
                value={modalData.notes}
                onChange={handleInputChange}
              />
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Add Subscription</Button>
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

export default AddSubscriptionModal
