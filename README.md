# Customer Support Web App
You can access the live website here: https://customer-support-web-app.vercel.app/auth/customer/login
(backend is hosted on render on free tier so it takes time in response, please have patience.)

## Login is suggested using these ids:
agent id: saurav or satyam
customer id: mahek

A web-based platform designed to facilitate customer support through real-time communication between customers and agents. The application enables customers to submit support requests and chat with agents in real-time, while agents can manage and resolve multiple support tickets, making sure only one agent can work on a ticket at once.

## Features

### Customer Side
![Customer Dashboard](static/customer_login.gif)
- Submit new support tickets and specify issues.
- View the history of support requests.
- Real-time chat functionality to communicate with support agents.

### Agent Side
![Agent Dashboard](static/agent_login.gif)
- Manage assigned, unassigned and resolved tickets.
- Respond to customer queries via real-time chat.
- View ticket history and manage multiple conversations.

### Real Time Chat
![Real-Time Chat Demo:](static/real_time_chat.gif)

## Project Design

The **Customer Support Web App** is built using the **MVC (Model-View-Controller)** architectural pattern, ensuring separation of concerns and making the project scalable and maintainable. 
The **client** is responsible for the user interface, while the **backend** manages business logic, database interactions, and Socket.IO connections for real-time chat functionality.

### Frontend Structure

The frontend is built using **React.js** and **TailwindCSS** for a clean and responsive user interface. It features two main components: one for customers and another for agents.

- **Components**:
  - `Customer`: Manages customer interactions, chat, and ticket submission.
  - `Agent`: Handles agent actions, such as ticket management and real-time communication.

- **Pages**:
  - `CustomerLogin` and `AgentLogin`: Authentication pages for customers and agents.
  - `CustomerDashboard` and `AgentDashboard`: Different dashboards for managing tickets and chats.

- **State Management**: State is managed using **React's useState and useEffect hooks** to handle real-time chat updates and form submissions.

### Backend Structure

The backend is built using **Node.js**, **Express.js**, and **MongoDB** for database storage. It is structured as follows:

- **Controllers**: 
  - Handle HTTP requests for ticket creation, management, and user authentication.
  
- **Services**:
  - Business logic and database interaction are abstracted into services (e.g., `ticketServices`, `messageServices`, `agentServices`, and `customerServices`).
  
- **Socket.IO**: 
  - Manages real-time communication between customers and agents. Events like `customer_join`, `agent_join`, and `send_message` are handled in real-time through WebSocket connections.
  
- **Database Models**: 
  - The database is designed with **Mongoose** models such as `Ticket`, `Message`, `Customer`, and `Agent` to store and retrieve data from MongoDB.


Here are the **installation steps**:

```markdown
## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Mahek-05/Customer-Support-Web-App.git
   ```

2. **Install dependencies** for both the backend and frontend:

   ```bash
   cd backend
   npm install

   cd ../client
   npm install
   ```

3. **Set up environment variables**:

   Create `.env` files in both `backend` and `client` directories.

   Example for `backend/.env`:
   ```plaintext
   MONGODB_URI=<Your MongoDB URI>
   PORT=3000
   FRONTEND_URI="http://localhost:5173"
   ```
   Example for `clent/.env`:
   ```plaintext
    VITE_API_BASE_URL="http://localhost:3000"
   ```



4. **Start the backend server**:

   ```bash
   cd backend
   npm run start
   ```
   or

    ```bash
   cd backend
   npm run dev
   ```

5. **Start the frontend**:

   ```bash
   cd ../client
   npm run dev
   ```

6. **Access the app** at `http://localhost:3000`.
```
