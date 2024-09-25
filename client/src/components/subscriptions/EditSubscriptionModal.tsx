import {Button, Modal} from "flowbite-react"
import axios from "axios"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import ToastNotification from "../ToastNotification"

const API_URL = import.meta.env.VITE_API_URL

const EditSubscriptionModal = ({
  open,
  onClose,
  subscriptionId,
  fetchSubscriptions,
}: any) => {
  const [modalData, setModalData] = useState({
    name: "",
    pricing: 0,
    billingCycle: "Monthly",
    notes: "",
  })
  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const [toastId, setToastId] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (subscriptionId) {
        const token = localStorage.getItem("jwt")
        if (!token) {
          navigate("/login")
          return
        }
        try {
          const response = await axios.get(
            `${API_URL}/subscriptions/${subscriptionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setModalData({
            name: response.data.name || "",
            pricing: response.data.pricing ?? 0,
            billingCycle: response.data.billingCycle || "Monthly",
            notes: response.data.notes || "",
          })
        } catch (error) {
          console.error("Error fetching subscription details:", error)
        }
      }
    }

    fetchSubscriptionDetails()
  }, [subscriptionId])

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
      await axios.put(`${API_URL}/subscriptions/${subscriptionId}`, modalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchSubscriptions()
      onClose()
      addToast("success", "Subscription updated successfully!")
    } catch (error: any) {
      console.error("Error updating subscription:", error)
      addToast("error", "Error updating subscription. Please try again.")
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
        <Modal.Header>Edit Subscription</Modal.Header>
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
                min={0}
                step={0.01}
                max={9999}
                required
                value={modalData.pricing}
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
                minLength={10}
                maxLength={512}
                value={modalData.notes}
                onChange={handleInputChange}
              />
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Update Subscription</Button>
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

export default EditSubscriptionModal
