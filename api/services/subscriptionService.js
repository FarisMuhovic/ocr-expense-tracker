const Subscription = require("../models/Subscription")

const getSubscriptions = async userId => {
  return await Subscription.find({userId})
}

const createSubscription = async subscriptionData => {
  const subscription = new Subscription(subscriptionData)
  return await subscription.save()
}

const getSubscriptionById = async id => {
  return await Subscription.findById(id)
}

const updateSubscription = async (id, updateData) => {
  return await Subscription.findByIdAndUpdate(id, updateData, {new: true})
}

const deleteSubscription = async id => {
  return await Subscription.findByIdAndDelete(id)
}

module.exports = {
  getSubscriptions,
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
}
