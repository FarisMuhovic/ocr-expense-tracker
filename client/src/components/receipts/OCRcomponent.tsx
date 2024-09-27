import {useState, ChangeEvent, FormEvent, useEffect} from "react"
import axios from "axios"
import ToastNotification from "../ToastNotification"

const apiKey = import.meta.env.VITE_AZURE_API_KEY as string
const endpoint = import.meta.env.VITE_AZURE_ENDPOINT as string
const modelID = "prebuilt-receipt"

interface Toast {
  id: number
  type: "success" | "error"
  message: string
}

const OCRComponent = () => {
  const [file, setFile] = useState<File | null>(null)
  const [ocrResult, setOcrResult] = useState<any | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState<boolean>(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (type: "success" | "error", message: string) => {
    const newToast: Toast = {
      id: Date.now(),
      type,
      message,
    }
    setToasts([...toasts, newToast])
  }

  const removeToast = (id: number) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      addToast("error", "Please select a file before uploading.")
      return
    }

    try {
      const response = await axios.post(
        `${endpoint}/documentintelligence/documentModels/${modelID}:analyze?api-version=2024-02-29-preview`,
        file,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Content-Type": "application/octet-stream",
          },
        }
      )

      const id = response.headers["operation-location"].split("/").pop()
      setResultId(id)
      setIsPolling(true)
      addToast("success", "File uploaded successfully. Analyzing...")
    } catch (error) {
      console.error("Error uploading file:", error)
      addToast("error", "Error uploading file. Please try again.")
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data)
      }
    }
  }

  const pollForResults = async (id: string) => {
    try {
      const resultResponse = await axios.get(
        `${endpoint}/documentintelligence/documentModels/${modelID}/analyzeResults/${id}`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
          },
        }
      )

      if (resultResponse.data.status === "succeeded") {
        setOcrResult(resultResponse.data.analyzeResult)
        setIsPolling(false)
        addToast("success", "OCR analysis succeeded.")
      } else if (resultResponse.data.status === "failed") {
        console.error("OCR Analysis failed:", resultResponse.data)
        setIsPolling(false)
        addToast("error", "OCR analysis failed. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching OCR data:", error)
      addToast("error", "Error fetching OCR data.")
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data)
      }
    }
  }

  useEffect(() => {
    let interval: any

    if (isPolling && resultId) {
      interval = setInterval(() => {
        pollForResults(resultId)
      }, 2000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isPolling, resultId])

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col md:flex-row gap-4 items-center border p-6 shadow-md rounded-md bg-white"
      >
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="block w-full md:w-auto p-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md w-full md:w-auto"
        >
          Upload and Analyze
        </button>
      </form>

      {/* Display OCR Results */}
      {ocrResult && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">OCR Results</h3>
          <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-4 py-2">Item Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {ocrResult.documents[0].fields?.Items?.valueArray.map(
                (item: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition duration-150"
                  >
                    <td className="border px-4 py-2">
                      {item?.valueObject?.Description?.content || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {item?.valueObject?.Quantity?.content || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {item?.valueObject?.Price?.content ||
                        item?.valueObject?.UnitPrice?.content ||
                        item?.valueObject?.TotalPrice?.content ||
                        "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-0 right-0 p-6">
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

export default OCRComponent
