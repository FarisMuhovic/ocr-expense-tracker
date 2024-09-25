import OCRComponent from "../components/receipts/OCRcomponent"

const Receipts = () => {
  return (
    <div className="flex">
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">
          Receipts - scan or upload your receipts here.
        </h1>
      </div>
      <OCRComponent />
    </div>
  )
}

export default Receipts
