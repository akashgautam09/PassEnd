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
```

For the frontend, create a separate `.env` file in the root directory:

```
.env
```

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Run the Application

Start the backend server:

```bash
node backend/server.js
```

Start the frontend:

```bash
npm run dev
```


Feedback and suggestions are welcome. You can open an issue or reach out via GitHub for any queries or improvements.
