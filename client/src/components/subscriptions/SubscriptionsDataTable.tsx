import React, {useEffect, useState} from "react"
import DataTable from "react-data-table-component"
import axios from "axios"
import Subscription from "../../interfaces/subscriptionOutput"
import {Button, Modal} from "flowbite-react"
import EditSubscriptionModal from "./EditSubscriptionModal"
import {useNavigate} from "react-router-dom"
import ToastNotification from "../ToastNotification"

const API_URL = import.meta.env.VITE_API_URL

interface Props {
  searchTerm: string
  fetchTrigger: boolean
}

const SubscriptionTable: React.FC<Props> = ({searchTerm, fetchTrigger}) => {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [noteContent, setNoteContent] = useState<string>("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const [idCounter, setIdCounter] = useState(0)

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("jwt")
      if (!token) {
        navigate("/login")
        return
      }
      const response = await axios.get(`${API_URL}/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSubscriptions(response.data)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchTrigger])

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (id: string) => {
    setSelectedSubscriptionId(id)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedSubscriptionId(id)
    setDeleteModalOpen(true)
  }

  const handleViewNote = (note: string) => {
    setNoteContent(note)
    setNoteModalOpen(true)
  }

  const addToast = (type: "success" | "error", message: string) => {
    const newToast = {id: idCounter, type, message}
    setToasts(prev => [...prev, newToast])
    setIdCounter(prev => prev + 1)

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, 3000)
  }

  const handleDelete = async () => {
    const token = localStorage.getItem("jwt")
    if (!token) {
      navigate("/login")
      return
    }
    if (!selectedSubscriptionId) {
      console.error("No subscription selected")
      return
    }
    try {
      await axios.delete(`${API_URL}/subscriptions/${selectedSubscriptionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchSubscriptions()
      addToast("success", "Successfully deleted the subscription!")
    } catch (error) {
      console.error("Error deleting subscription:", error)
      addToast("error", "Failed to delete the subscription!")
    } finally {
      setDeleteModalOpen(false)
      setSelectedSubscriptionId(null)
    }
  }
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }
  const columns = [
    {
      name: "Subscription Name",
      selector: (row: Subscription) => row.name,
      sortable: true,
      sortFunction: (a: Subscription, b: Subscription) => {
        return a.name.localeCompare(b.name)
      },
    },
    {
      name: "Pricing",
      selector: (row: Subscription) => row.pricing,
      sortable: true,
      cell: (row: Subscription) => `$${row.pricing.toFixed(2)}`,
    },

    {
      name: "Billing Cycle",
      selector: (row: Subscription) => row.billingCycle,
    },
    {
      name: "Start Date",
      selector: (row: Subscription) =>
        new Date(row.startDate).toLocaleDateString(),
    },
    {
      name: "Notes",
      cell: (row: Subscription) =>
        row.notes ? (
          <button
            className="bg-green-300 p-2"
            onClick={() => handleViewNote(row.notes)}
          >
            See Note
          </button>
        ) : null,
      ignoreRowClick: true,
    },
    {
      name: "Actions",
      cell: (row: Subscription) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-300 p-2"
            onClick={() => handleEdit(row._id)}
          >
            Edit
          </button>
          <button
            className="bg-red-300 p-2"
            onClick={() => handleDeleteClick(row._id)}
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ]

  return (
    <div className="border-[1px] border-gray-400 rounded-lg">
      <DataTable
        title="Subscription List"
        columns={columns}
        data={filteredSubscriptions}
        progressPending={loading}
        pagination
      />
      <EditSubscriptionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        subscriptionId={selectedSubscriptionId}
        fetchSubscriptions={fetchSubscriptions}
      />
      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Header>Delete Subscription</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this subscription?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Delete</Button>
          <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={noteModalOpen} onClose={() => setNoteModalOpen(false)}>
        <Modal.Header>Note</Modal.Header>
        <Modal.Body>
          <p>{noteContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setNoteModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="absolute bottom-4 right-4">
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
    </div>
  )
}

export default SubscriptionTable
