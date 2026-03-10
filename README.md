# Circled API

A full-stack fitness coaching platform. Node.js/Express backend + React 18 frontend.

---

## Project Structure

```
circled-api/
├── app.js                  # Express app entry point
├── package.json            # Backend dependencies & scripts
├── .env                    # Environment variables (never commit this)
├── .env.example            # Template for required env vars
│
├── config/                 # App configuration (DB, port, etc.)
├── middleware/             # Auth middleware (CheckAuth, checkTempAuth)
├── routes/                 # API route definitions
├── controllers/            # Business logic for each route
├── models/                 # Mongoose database schemas
├── components/             # Socket.io service
├── utils/                  # Email, notification helpers
├── templates/              # Email HTML templates
│
└── client/                 # React 18 frontend (Vite)
    ├── src/
    │   ├── App.jsx
    │   ├── pages/          # Page-level components
    │   ├── sections/       # Feature sections (auth, dashboard, etc.)
    │   ├── contexts/       # React Context (JWTContext)
    │   ├── redux/          # Redux state management
    │   ├── components/     # Reusable UI components
    │   ├── utils/          # Axios instance, helpers
    │   └── routes/         # React Router definitions
    ├── package.json
    └── vite.config.js      # Vite bundler config (with API proxy)
```

---

## API Routes

| Prefix              | Controller         | Purpose                        |
|---------------------|--------------------|--------------------------------|
| `/api/user`         | user.js            | Auth, profile, settings        |
| `/api/otp`          | otp.js             | OTP verification               |
| `/api/program`      | Programs.js        | Workout programs (CRUD)        |
| `/api/library`      | LibraryV2.js       | Exercise library               |
| `/api/sentprogram`  | SentProgram.js     | Programs sent to clients       |
| `/api/order`        | Orders.js          | Purchased programs             |
| `/api/payment`      | Payments.js        | Stripe payments                |
| `/api/chat`         | Chat.js            | Real-time messaging            |
| `/api/notification` | Notification.js    | Push notifications             |
| `/api/recent`       | RecentController.js| Recently viewed items          |
| `/api/progresslog`  | ProgressLogs.js    | Client progress tracking       |
| `/api/bodyImages`   | BodyImages.js      | Body transformation photos     |
| `/api/inviteClient` | InviteClient.js    | Client invitations             |
| `/api/clients`      | Clients.js         | Client management              |
| `/api/misc`         | misc.js            | Email, verification, misc      |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- A `.env` file (copy from `.env.example` and fill in values)

### Backend

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start
```

The backend runs on **port 3001** by default.

### Frontend

```bash
cd client

# Install dependencies
npm install

# Run dev server (proxies /api to localhost:3001)
npm run dev

# Build for production
npm run build
```

The frontend dev server runs on **port 3000** by default.

### Run Both at Once

```bash
# From the root folder
npm run dev:all
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```
# App
PORT=3001
NODE_ENV=DEV

# Database
MONGO_URI=mongodb+srv://...

# Auth
jwtSecret=your-strong-secret-here

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=...

# Twilio (SMS/OTP)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE=...

# Email
MAIL_USER=...
MAIL_PASS=...
```

> ⚠️ Never commit `.env` to GitHub. It's already in `.gitignore`.

---

## Key Technologies

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB Atlas, Mongoose 5           |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| Payments   | Stripe                              |
| Real-time  | Socket.io 4                         |
| SMS / OTP  | Twilio                              |
| File Store | AWS S3                              |
| Email      | Nodemailer + Handlebars templates   |
| Frontend   | React 18, Vite, MUI, Redux Toolkit  |
| Bundling   | Vite with manual chunk splitting    |

---

## Deployment

For cloud deployment, the recommended setup is:

- **Backend** → [Railway](https://railway.app) or [Render](https://render.com)
- **Frontend** → Build with `npm run build:client`, deploy `build/` to [Netlify](https://netlify.com)

See `SETUP_STEPS.md` for a step-by-step deployment guide.
