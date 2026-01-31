# Razorpay MERN Payment Kit

A **production-ready, modular payment system** built using the MERN stack and Razorpay APIs.  
This repository is designed to be a **drop-in payment solution** for real-world client projects, SaaS products, and subscription-based platforms.

The system supports **one-time payments, recurring subscriptions, webhooks, JWT authentication, RBAC, Razorpay customer creation, and billing portal integration**.

---

## Features

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
- Redirect-based billing portal access

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

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Razorpay Node SDK
- JWT Authentication

### Frontend
- React
- Axios
- Razorpay Checkout

---

## Project Structure

```

backend/
├── controllers/
├── routes/
├── models/
├── middleware/
├── services/
├── webhooks/
└── server.js

frontend/
├── components/
├── pages/
├── services/
└── App.js

```

---

## Environment Variables

Create a `.env` file in the backend directory:

```

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri

```

Frontend `.env` file:

```

REACT_APP_RAZORPAY_KEY_ID=your_key_id

```

---

## Core Flows

### One-Time Payment
1. Client requests order creation
2. Backend creates Razorpay order
3. Razorpay checkout completes payment
4. Backend verifies signature
5. Payment stored in database

### Subscription Payment
1. Razorpay customer created (if not exists)
2. Subscription created using plan
3. Checkout completes subscription
4. Webhooks update subscription status

### Billing Portal
1. Backend generates billing portal session
2. User redirected to Razorpay-hosted portal
3. User manages subscriptions and payment methods

---

## Testing

- Uses Razorpay **test mode**
- Payments, subscriptions, and webhooks can be fully tested using test keys
- Webhooks can be tested via Razorpay Dashboard

---

## Use Cases

- SaaS products
- Subscription-based platforms
- Client payment integrations
- Freelance / agency projects
- MVPs and production systems

---

## Customization

- Auth system can be extended or replaced
- UI is minimal and can be swapped
- Designed to integrate easily into existing MERN projects
- Can be adapted for other stacks

---

## Notes

- Frontend UI is intentionally minimal
- Focus is on correctness, security, and extensibility
- Built as a reusable payment kit, not a demo

---

## License

MIT License
```

---
