# Running Frontend and Backend Together

This repo is set up so you can keep the frontend (e.g. **circled-ui**) in a `client/` folder and run both with one command.

## 1. Put the frontend in this repo

From the **parent folder** (e.g. `Circled/`):

```bash
# Option A: Copy the frontend into client/
cp -r circled-ui circled-api/client

# Option B: Symlink (so you edit one place)
cd circled-api && ln -s ../circled-ui client
```

So the layout is:

```
circled-api/
├── app.js
├── client/          ← your frontend (circled-ui)
│   ├── src/
│   ├── vite.config.js
│   ├── package.json
│   └── ...
├── build/           ← frontend build output (used by backend)
├── build_prod/
├── package.json
└── ...
```

## 2. Local development

**Ports:**

- **Frontend (Vite):** `http://localhost:3000`
- **Backend (API):** `http://localhost:3001`

**Option A – Run both from repo root**

```bash
npm install
npm run dev:all
```

Then open **http://localhost:3000**. The frontend will call the API on 3001.

**Option B – Two terminals**

```bash
# Terminal 1 – backend
npm run dev

# Terminal 2 – frontend (from repo root)
npm run dev:client
```

**Frontend env for local API**

In `client/` create or edit `.env.development` (or `.env.local`) so the app talks to the local backend:

```env
VITE_APP_API_URL=http://localhost:3001
VITE_APP_API_PROTOCOL=http
```

If the frontend uses a **Vite proxy** instead of full URLs, add this in `client/vite.config.js` under `server`:

```js
server: {
  port: 3000,
  proxy: {
    '/api': { target: 'http://localhost:3001', changeOrigin: true },
    '/socket.io': { target: 'http://localhost:3001', ws: true },
  },
}
```

Then you can use relative API URLs and keep `VITE_APP_API_URL` empty or same-origin in dev.

## 3. Production build (backend serves frontend)

Build the frontend and copy into the folders the backend serves:

```bash
# Dev build → build/
npm run build:client

# Prod build → build_prod/
npm run build:client:prod
```

Then start the backend:

```bash
npm run prod
```

Backend serves the app from `build/` or `build_prod/` (depending on `NODE_ENV`) and handles `/api/*` and Socket.IO.

## 4. Scripts summary

| Script | Description |
|--------|-------------|
| `npm run dev` | Backend only (port 3001) |
| `npm run dev:client` | Frontend only (port 3000), requires `client/` |
| `npm run dev:all` | Backend + frontend (needs `concurrently` and `client/`) |
| `npm run build:client` | Build frontend → `build/` |
| `npm run build:client:prod` | Build frontend → `build_prod/` |
| `npm run prod` | Backend in PROD mode, serves built frontend |

## 5. Override ports

In `.env`:

```env
APP_DEV_PORT=3001
APP_PROD_PORT=80
```

Backend will use these when set.
