# Razorpay MERN Payment Kit

A **production-ready, modular payment system** built using the MERN stack and Razorpay APIs.  
This repository is designed to be a **drop-in payment solution** for real-world client projects, SaaS products, and subscription-based platforms.

The system supports **one-time payments, recurring subscriptions, webhooks, JWT authentication, RBAC, Razorpay customers, and billing portal integration**.

---

## 🚀 Features

### Payments
- One-time payment flow using Razorpay Orders API
- Secure payment verification using signature validation
- Payment status persistence in MongoDB

### Subscriptions
- Recurring subscription creation using Razorpay Subscriptions API
- Subscription lifecycle tracking (active, cancelled, expired)
- Plan-based billing support

### Customers & Billing
- Automatic Razorpay customer creation
- Billing portal session generation
- Redirect-based billing portal access for users

### Security & Access Control
- JWT-based authentication
- Role-Based Access Control (RBAC)
  - Admin
  - Customer
- Protected APIs for sensitive operations

### Webhooks
- Secure webhook signature verification
- Handles events such as:
  - Payment success / failure
  - Subscription renewal / cancellation
  - Refunds
- Automatic database sync via webhook events

---

## 🧱 Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Razorpay Node SDK
- JWT Authentication

**Frontend**
- React
- Axios
- Razorpay Checkout

---

## 📁 Project Structure

