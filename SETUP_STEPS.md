# Circled: Step-by-Step Setup (Beginner Guide)

This guide gets your **frontend** (the website users see) and **backend** (the server that handles data) running together on your computer. Follow the steps in order.

---

## What you need before starting

- Your **circled-api** folder (this project) on your computer
- Your **circled-ui** folder (the frontend) — it should be in the same parent folder as circled-api, like this:

```
Circled (or whatever your main folder is called)
├── circled-api   ← backend
└── circled-ui    ← frontend
```

- **Node.js** installed ([nodejs.org](https://nodejs.org) — download the “LTS” version if you’re not sure)

---

## STEP 1: Put the frontend inside the backend folder

You will make a copy of your frontend **inside** the backend project so one folder contains both.

1. Open **Finder** (Mac) or **File Explorer** (Windows).
2. Go to the folder that contains **both** `circled-api` and `circled-ui` (e.g. `Circled` or `Web Development`).
3. **Copy** the entire `circled-ui` folder:
   - Click on `circled-ui`
   - Press **Cmd + C** (Mac) or **Ctrl + C** (Windows)
4. Open the **circled-api** folder.
5. **Paste** inside it:
   - Press **Cmd + V** (Mac) or **Ctrl + V** (Windows)
6. **Rename** the pasted folder to exactly: **client**
   - Right‑click the pasted `circled-ui` folder → **Rename** → type **client**

When you’re done, inside `circled-api` you should see a folder named **client** (with all the frontend files inside it). Your structure should look like:

```
circled-api
├── client          ← your frontend (renamed from circled-ui)
├── app.js
├── package.json
├── build
└── ... other backend files
```

---

## STEP 2: Install backend dependencies

This installs the packages the backend needs to run.

1. Open **Terminal** (Mac: search “Terminal” in Spotlight) or **Command Prompt** (Windows: search “cmd”).
2. Go to your backend folder by typing this (replace the path with your actual path if different):

   **Mac:**
   ```bash
   cd ~/Desktop/Web\ Development/Circled/circled-api
   ```
   Press **Enter**.

   **Windows:**
   ```bash
   cd C:\Users\YourUsername\Desktop\Web Development\Circled\circled-api
   ```
   Press **Enter**. (Change `YourUsername` to your Windows username.)

3. Run:
   ```bash
   npm install
   ```
   Press **Enter** and wait until it finishes (no red errors).

---

## STEP 3: Install frontend dependencies

This installs the packages the frontend needs.

1. You should still be in the **circled-api** folder in Terminal.
2. Type:
   ```bash
   cd client
   ```
   Press **Enter**.
3. Type:
   ```bash
   npm install
   ```
   Press **Enter** and wait until it finishes.
4. Go back to the main project folder:
   ```bash
   cd ..
   ```
   Press **Enter**.

---

## STEP 4: Tell the frontend where the backend is (for local use)

When you run everything on your computer, the frontend needs to know: “the API is at http://localhost:3001”.

1. Open the **client** folder in Finder / File Explorer.
2. Look for a file named **.env.development** or **.env.local**.
   - If you don’t see it, the folder might be hiding files that start with a dot. On Mac: in Finder menu **View → Show View Options**, enable “Show hidden files” if you have that option; or create the file in the next step.
3. **Create or edit** this file in a text editor (e.g. Notepad, VS Code, Cursor):
   - If the file doesn’t exist, create a new file and name it exactly: **.env.development**
   - Put this inside the file (copy and paste):

   ```
   VITE_APP_API_URL=http://localhost:3001
   VITE_APP_API_PROTOCOL=http
   ```

4. Save the file inside the **client** folder.

---

## STEP 5: Run both frontend and backend together

Now you start both the server and the website with one command.

1. In Terminal, make sure you are in the **circled-api** folder (not inside `client`).
   - If you’re not sure, type:
     ```bash
     cd ~/Desktop/Web\ Development/Circled/circled-api
     ```
     (Mac; adjust path if yours is different.)
2. Run:
   ```bash
   npm run dev:all
   ```
   Press **Enter**.

3. Wait until you see two things running (you might see lines like “api” and “client” in blue and green).
4. Open your **web browser** (Chrome, Safari, etc.).
5. In the address bar type:
   ```
   http://localhost:3000
   ```
   Press **Enter**.

You should see your Circled app. The website (frontend) is on port 3000 and it talks to the backend on port 3001.

---

## STEP 6: Stopping the app

When you want to stop everything:

1. Go to the Terminal window where you ran `npm run dev:all`.
2. Press **Ctrl + C** (Mac and Windows).
3. If it asks “Terminate batch job?” or similar, type **Y** and press **Enter**.

---

## If something goes wrong

### “Cannot find module” or “npm not found”
- Make sure **Node.js** is installed. In Terminal type `node -v` and press Enter. You should see a version number.

### “No such file or directory: client”
- You didn’t complete Step 1. The **client** folder must be inside **circled-api**, and it must be named **client**.

### “Port 3000 is already in use”
- Something else is using port 3000. Close other apps that might be running a server, or restart your computer and try again.

### The page loads but login/API doesn’t work
- Check Step 4: the **client** folder must have **.env.development** with:
  - `VITE_APP_API_URL=http://localhost:3001`
  - `VITE_APP_API_PROTOCOL=http`
- Then stop the app (Step 6) and run `npm run dev:all` again.

### You need to use a real database
- Backend uses MongoDB. Put your MongoDB connection string in a **.env** file in the **circled-api** folder (not in `client`). Use the same variable names as in **.env.example** in circled-api.

---

## Quick reference

| What you want to do        | Command              | Where to run it   |
|----------------------------|----------------------|--------------------|
| Run both app + API         | `npm run dev:all`    | Inside circled-api |
| Run only the API           | `npm run dev`        | Inside circled-api |
| Run only the frontend      | `npm run dev:client` | Inside circled-api |
| Open the app in browser    | Go to                | http://localhost:3000 |
| Stop the app               | Press **Ctrl + C**   | In the same Terminal window |

If you tell me which step you’re on and what you see (or any error message), I can give you the next exact click or command.
