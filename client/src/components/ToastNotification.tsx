import React from "react"
import {Toast} from "flowbite-react"
import {HiCheck, HiExclamation} from "react-icons/hi"

interface ToastProps {
  id: number
  type: "success" | "error"
  message: string
  removeToast: (id: number) => void
}

const ToastNotification: React.FC<ToastProps> = ({
  id,
  type,
  message,
  removeToast,
}) => {
  return (
    <Toast
      key={id}
      className={`mb-2 ${type === "success" ? "bg-green-200" : "bg-red-200"}`}
    >
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        {type === "success" ? (
          <HiCheck className="h-5 w-5 text-green-500" />
        ) : (
          <HiExclamation className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="ml-3 text-sm font-normal px-2">{message}</div>
      <Toast.Toggle
        onClick={() => removeToast(id)}
        className="bg-transparent"
      />
    </Toast>
  )
}

export default ToastNotification
