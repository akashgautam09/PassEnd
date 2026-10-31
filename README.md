🔐 PassEnd – Your Own Password Manager

PassEnd is a full-stack password manager that enables users to securely store and manage their credentials. Built using the MERN stack, it offers a responsive interface along with essential features for efficient password handling.

---

Features

* **Secure Credential Storage** – Store and manage website credentials in a structured vault
* **Edit & Delete Support** – Easily update or remove saved entries
* **Copy Functionality** – One-click copy for usernames and passwords
* **Password Visibility Toggle** – Show or hide passwords when needed
* **User Notifications** – Real-time feedback using toast notifications
* **Responsive UI** – Clean and modern interface built with Tailwind CSS

---

🛠 Tech Stack

Frontend

* React (Vite)
* Tailwind CSS
* Clerk (Authentication)

Backend

* Node.js
* Express.js
* MongoDB (Native Driver)
* Clerk (Backend Authentication)

---

**Live Demo :** [View the application →](https://passend.vercel.app)

---

⚙️ Installation & Setup

1. Clone the Repository

```bash
git clone https://github.com/akashgautam09/PassEnd.git
cd PassEnd
```

2. Install Dependencies

```bash
npm install
```

3. Environment Variables

Create a `.env` file inside the **backend folder**:

```
backend/.env
```

Add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
ALLOWED_ORIGINS=https://passend.vercel.app
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=64_hex_characters
```

`ENCRYPTION_KEY` must be a stable 32-byte secret. New vault values are encrypted
with AES-256-GCM. Existing AES-CBC records remain readable during migration.

For the frontend, create a separate `.env` file in the root directory:

```
.env
```

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# Optional: override the API URL. Defaults to localhost in development
# and https://passend.onrender.com in production.
# VITE_API_URL=http://localhost:3001
```

The frontend automatically uses `http://localhost:3001` with `npm run dev`
and `https://passend.onrender.com` in a production build. For another
deployment, set `VITE_API_URL` in that hosting platform's environment variables.

4. Run the Application

Start the backend server:

```bash
node backend/server.js
```

Start the frontend:

```bash
npm run dev
```

5. Release Checklist

Before a production launch:

* Rotate MongoDB, Clerk, and encryption secrets if they were ever committed,
	shared, or exposed. Store replacement values only in local ignored files and
	deployment secret settings.
* Confirm environment files are not tracked:

```bash
git ls-files .env backend/.env
```

* Start the backend and verify readiness:

```bash
curl http://localhost:3001/health
```

The health endpoint must return `{"status":"ready"}` before frontend traffic
is sent to the API.

* Run the local quality checks:

```bash
npm test
npm run lint
npm run build
```

* Confirm the configured CORS origins match the deployed frontend URL.
* Test with two separate accounts. Each account must only see, update, and
	delete its own vault entries.
* Test create, reload, edit, favorite, search, category filtering, sorting,
	delete, password reveal, copy, and sign-out of other devices.

Existing AES-CBC records are read-only migration input. New records and updates
use AES-256-GCM. Do not change `ENCRYPTION_KEY` without a planned migration.


Feedback and suggestions are welcome. You can open an issue or reach out via GitHub for any queries or improvements.
