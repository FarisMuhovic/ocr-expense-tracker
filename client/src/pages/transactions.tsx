import {useState} from "react"
import {FaSearch} from "react-icons/fa"
import AddTransactionModal from "../components/transactions/AddTransactionModal"
import Transaction from "../interfaces/transactionInput"
import TransactionsTable from "../components/transactions/TransactionsDataTable"

const Transactions: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [fetchTrigger, setFetchTrigger] = useState(false)
  const [modalData, setModalData] = useState({
    date: new Date(),
    name: "",
    price: 0,
    quantity: 1,
    category: "Miscellaneous",
  } as Transaction)

  const [searchTerm, setSearchTerm] = useState("")
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="flex">
      <div className="flex gap-6 flex-col flex-1 p-4">
        <h4 className="text-xl py-2 font-semibold">
          Transactions - manually add one time expenses here.
        </h4>
        <div className="flex  place-items-center  border-gray-700 h-12">
          <div className="flex items-center border-[1px] border-gray-300 gap-2 w-full pl-4">
            <FaSearch className="w-5 h-5 text-gray-500" />
            <input
              type="search"
              name="search"
              id="search-bar"
              placeholder="Search for a transaction by name"
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full py-2 h-12"
              value={searchTerm}
              onChange={handleSearchChange}
            />{" "}
          </div>
          <button
            className="w-64 ml-auto h-full bg-blue-400"
            onClick={() => setOpenModal(true)}
          >
            Add transaction
          </button>
          <AddTransactionModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            modalData={modalData}
            setModalData={setModalData}
            setFetchTrigger={setFetchTrigger}
          />
        </div>
        <TransactionsTable
          searchTerm={searchTerm}
          fetchTrigger={fetchTrigger}
        />
      </div>
    </div>
  )
}

export default Transactions
