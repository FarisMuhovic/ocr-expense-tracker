interface Subscription {
  name: string
  pricing: number
  billingCycle: "Monthly" | "Quarterly" | "Semiannual" | "Annual"
  note?: string
}

export default Subscription
