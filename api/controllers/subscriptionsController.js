const subscriptionService = require("../services/subscriptionService")

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions(
      req.user.id
    )
    res.json(subscriptions)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const createNewSubscription = async (req, res) => {
  try {
    const {id: userId} = req.user

    const subscription = await subscriptionService.createSubscription({
      ...req.body,
      userId,
    })

    res.status(201).json(subscription)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const getSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(
      req.params.id
    )
    if (subscription) {
      res.json(subscription)
    } else {
      res.status(404).json({message: "Subscription not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const updateSubscription = async (req, res) => {
  try {
    const updatedSubscription = await subscriptionService.updateSubscription(
      req.params.id,
      req.body
    )
    if (updatedSubscription) {
      res.json(updatedSubscription)
    } else {
      res.status(404).json({message: "Subscription not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const deleteSubscription = async (req, res) => {
  try {
    const deletedSubscription = await subscriptionService.deleteSubscription(
      req.params.id
    )
    if (deletedSubscription) {
      res.json({message: "Subscription deleted"})
    } else {
      res.status(404).json({message: "Subscription not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  getAllSubscriptions,
  createNewSubscription,
  getSubscription,
  updateSubscription,
  deleteSubscription,
}
