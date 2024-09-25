import {useState} from "react"
import {FaSearch} from "react-icons/fa"
import AddSubscriptionModal from "../components/subscriptions/AddSubscriptionModal"
import SubscriptionTable from "../components/subscriptions/SubscriptionsDataTable"
import Subscription from "../interfaces/subscriptionInput"

const Subscriptions: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [fetchTrigger, setFetchTrigger] = useState(false)
  const [modalData, setModalData] = useState({
    name: "",
    pricing: 0,
    billingCycle: "Monthly",
    notes: "",
  } as Subscription)

  const [searchTerm, setSearchTerm] = useState("")
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="flex">
      <div className="flex gap-6 flex-col flex-1 p-4">
        <h4 className="text-xl py-2 font-semibold">
          Subscriptions - add reocurring payments here.
        </h4>
        <div className="flex pl-4 place-items-center gap-2 border-[1px] border-gray-700 shadow-sm h-12">
          <FaSearch className="w-6 h-6" />
          <input
            type="search"
            name="search"
            id="search-bar"
            placeholder="Search for a subscription by name"
            className="bg-transparent border-none focus:ring-0 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="w-64 ml-auto h-full bg-blue-400"
            onClick={() => setOpenModal(true)}
          >
            Add subscription
          </button>
          <AddSubscriptionModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            modalData={modalData}
            setModalData={setModalData}
            setFetchTrigger={setFetchTrigger}
          />
        </div>
        <SubscriptionTable
          searchTerm={searchTerm}
          fetchTrigger={fetchTrigger}
        />
      </div>
    </div>
  )
}

export default Subscriptions
