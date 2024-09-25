import {Spinner} from "flowbite-react"

const Loader = () => {
  return (
    <div className="flex place-items-center justify-center align-middle w-screen h-screen">
      <Spinner aria-label="Loading..." size={"xl"} />
    </div>
  )
}

export default Loader
