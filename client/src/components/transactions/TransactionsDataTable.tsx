import React, {useEffect, useState} from "react"
import DataTable from "react-data-table-component"
import axios from "axios"
import Transaction from "../../interfaces/transactionOutput"
import {Button, Modal} from "flowbite-react"
import EditTransactionModal from "./EditTransactionModal"
import {useNavigate} from "react-router-dom"
import ToastNotification from "../ToastNotification"

const API_URL = import.meta.env.VITE_API_URL

interface Props {
  searchTerm: string
  fetchTrigger: boolean
}

const TransactionsTable: React.FC<Props> = ({searchTerm, fetchTrigger}) => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [toasts, setToasts] = useState<
    {id: number; type: "success" | "error"; message: string}[]
  >([])
  const [idCounter, setIdCounter] = useState(0)

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("jwt")
      if (!token) {
        navigate("/login")
        return
      }
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTransactions(response.data)
    } catch (error: any) {
      console.error("Error fetching transactions:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [fetchTrigger])

  const filteredTransactions = transactions.filter(transaction =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (id: string) => {
    setSelectedTransactionId(id)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedTransactionId(id)
    setDeleteModalOpen(true)
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
    if (!selectedTransactionId) {
      console.error("No transaction selected")
      return
    }
    try {
      await axios.delete(`${API_URL}/transactions/${selectedTransactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchTransactions()
      addToast("success", "Successfully deleted the transaction!")
    } catch (error: any) {
      console.error("Error deleting transaction:", error)
      addToast("error", "Failed to delete the transaction!")
      if (error.response?.status === 401) {
        localStorage.removeItem("jwt")
        navigate("/login")
      }
    } finally {
      setDeleteModalOpen(false)
      setSelectedTransactionId(null)
    }
  }
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }
  const columns = [
    {
      name: "Transaction Name",
      selector: (row: Transaction) => row.name,
      sortable: true,
      sortFunction: (a: Transaction, b: Transaction) => {
        return a.name.localeCompare(b.name)
      },
    },
    {
      name: "Pricing",
      selector: (row: Transaction) => row.price,
      sortable: true,
      cell: (row: Transaction) => `$${row.price.toFixed(2)}`,
    },
    {
      name: "Quantity",
      selector: (row: Transaction) => row.quantity,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Transaction) => new Date(row.date).toLocaleDateString(),
    },
    {
      name: "Category",
      selector: (row: Transaction) => row.category,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Transaction) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-300 py-2 px-4"
            onClick={() => handleEdit(row._id)}
          >
            Edit
          </button>
          <button
            className="bg-red-300 py-2 px-4"
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
    <div className="border-[1px] border-gray-400">
      <DataTable
        title="Transaction List"
        columns={columns}
        data={filteredTransactions}
        progressPending={loading}
        pagination
      />
      <EditTransactionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        transactionId={selectedTransactionId}
        fetchTransactions={fetchTransactions}
      />
      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Header>Delete Transaction</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this transaction?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Delete</Button>
          <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
            Cancel
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

export default TransactionsTable
