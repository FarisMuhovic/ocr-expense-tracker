import OCRComponent from "../components/receipts/OCRcomponent"

const Receipts = () => {
  return (
    <div className="flex">
      <div className="flex-1 p-10 gap-4 flex flex-col">
        <h1 className="text-3xl font-bold">
          Receipts - scan or upload your receipts here.
        </h1>
        <OCRComponent />
      </div>
    </div>
  )
}

export default Receipts
