import {useState, ChangeEvent, FormEvent, useEffect} from "react"
import axios from "axios"

const apiKey = import.meta.env.VITE_AZURE_API_KEY as string
const endpoint = import.meta.env.VITE_AZURE_ENDPOINT as string
const modelID = "prebuilt-receipt" 

const OCRComponent = () => {
  const [file, setFile] = useState<File | null>(null)
  const [ocrResult, setOcrResult] = useState<any | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState<boolean>(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      alert("Please select a file or take a photo")
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
    } catch (error) {
      console.error("Error fetching OCR data:", error)
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
      } else if (resultResponse.data.status === "failed") {
        console.error("OCR Analysis failed:", resultResponse.data)
        setIsPolling(false)
      }
    } catch (error) {
      console.error("Error fetching OCR data:", error)
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

  console.log(ocrResult?.content)

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-10">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
        <button type="submit">Upload and Analyze</button>
      </form>
    </div>
  )
}

export default OCRComponent
