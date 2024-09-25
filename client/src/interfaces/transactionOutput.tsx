interface Transaction {
  _id: string
  date: Date
  name: string
  price: number
  quantity: number
  category:
    | "Groceries"
    | "Transportation"
    | "Utilities"
    | "Rent/Mortgage"
    | "Insurance"
    | "Healthcare"
    | "Entertainment"
    | "Dining Out"
    | "Clothing"
    | "Education"
    | "Travel"
    | "Personal Care"
    | "Miscellaneous"
}
export default Transaction
