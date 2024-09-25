import {useState, ChangeEvent, FormEvent} from "react"
import axios from "axios"

const apiKey = import.meta.env.VITE_AZURE_API_KEY as string
const endpoint = import.meta.env.VITE_AZURE_ENDPOINT as string

interface OcrResult {
  regions: {
    lines: {
      words: {
        text: string
      }[]
    }[]
  }[]
}

const OCRComponent = () => {
  const [file, setFile] = useState<File | null>(null)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      alert("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post<OcrResult>(
        `${endpoint}/vision/v3.2/ocr?language=unk&detectOrientation=true`,
        formData,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Content-Type": "application/octet-stream",
          },
        }
      )

      setOcrResult(response.data)
    } catch (error) {
      console.error("Error fetching OCR data:", error)
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data)
      }
    }
  }

  // Function to render OCR results in a readable format
  const renderOcrResults = () => {
    if (!ocrResult) return null

    return ocrResult.regions.map((region, regionIndex) => (
      <div key={regionIndex} style={{marginBottom: "20px"}}>
        <h3>Region {regionIndex + 1}</h3>
        {region.lines.map((line, lineIndex) => (
          <div key={lineIndex}>
            {line.words.map((word, wordIndex) => (
              <span key={wordIndex} style={{marginRight: "5px"}}>
                {word.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    ))
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-10">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload and Analyze</button>
      </form>
      {ocrResult && (
        <div>
          <h2>OCR Result</h2>
          {renderOcrResults()}
        </div>
      )}
    </div>
  )
}

export default OCRComponent
