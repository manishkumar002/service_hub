const User = require("../models/users");
const Job = require("../models/jobs");
const Category = require("../models/category");
const Payment = require("../models/payment");
const Subscription = require("../models/subscription");
const Message = require("../models/message");

module.exports = {
    users: User,
    jobs: Job,
    categories: Category,
    payments: Payment,
    subscriptions: Subscription,
    messages: Message
};