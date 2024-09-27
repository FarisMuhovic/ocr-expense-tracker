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
      <div className="flex gap-6 flex-col flex-1 p-4 overflow-x-auto">
        <h4 className="text-xl py-2 font-semibold">
          Subscriptions - add reocurring payments here.
        </h4>
        <div className="flex  place-items-center  border-gray-700 h-12">
          <div className="flex items-center border-[1px] border-gray-300 gap-2 w-full pl-4">
            <FaSearch className="w-5 h-5 text-gray-500" />
            <input
              type="search"
              name="search"
              id="search-bar"
              placeholder="Search for a subscription by name"
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full py-2 h-12"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
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
        <div className="overflow-x-auto">
          <SubscriptionTable
            searchTerm={searchTerm}
            fetchTrigger={fetchTrigger}
          />
        </div>
      </div>
    </div>
  )
}

export default Subscriptions
