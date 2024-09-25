const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  name: {type: String, required: true},
  pricing: {type: Number, required: true},
  billingCycle: {
    type: String,
    enum: ["Monthly", "Quarterly", "Semiannual", "Annual"],
    required: true,
  },
  startDate: {type: Date, default: Date.now},
  notes: {type: String},
})

const Subscription = mongoose.model("Subscription", subscriptionSchema)

module.exports = Subscription
