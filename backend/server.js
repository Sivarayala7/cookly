import express from 'express';                // import core framework // comment #1
import dotenv from 'dotenv/config';           // load .env variables   // comment #2
import morgan from 'morgan';                  // dev request logger    // comment #3
import cookieParser from 'cookie-parser';     // read auth cookies     // comment #4
import cors from 'cors';                      // cross-origin support  // comment #5
import connectDB from './config/db.js';       // mongo connector fn    // comment #6

// route files ------------------------------------------------------
import authRoutes from './routes/authRoutes.js';           // auth endpoints
import recipeRoutes from './routes/recipeRoutes.js';       // recipe endpoints
import commentRoutes from './routes/commentRoutes.js';     // comment endpoints (nested)
import userRoutes from './routes/userRoutes.js';           // profile / follow endpoints
// ------------------------------------------------------------------

const app = express();                       // create express app    // #1

// ─── global middleware stack ──────────────────────────────────────
app.use(cors({ origin: true, credentials: true })); // allow any FE  // #2
app.use(express.json());                       // parse JSON body     // #3
app.use(cookieParser());                       // parse cookies       // #4
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));                      // verbose logging     // #5
}
// ──────────────────────────────────────────────────────────────────

// API Routes (versioned prefix keeps future options open) ----------
app.use('/api/auth', authRoutes);              // /register /login     // #1
app.use('/api/recipes', recipeRoutes);         // GET, POST etc        // #2
app.use('/api/recipes', commentRoutes);        // nested → comments    // #3
app.use('/api/users', userRoutes);             // profile    // #4
// ------------------------------------------------------------------

// basic ping route  -------------------------------------------------
app.get('/', (_req, res) => res.json({ msg: 'Cookly API running 🚀' }));
// ------------------------------------------------------------------

const PORT = process.env.PORT || 5000;         // choose port          // #1
const start = async () => {                    // self-invoking helper // #2
  await connectDB();                           // link to Mongo        // #3
  app.listen(PORT, () =>                       // start http server    // #4
    console.log(`⚡ Server on http://localhost:${PORT}`)              // #5
  );
};
start();                                       // fire it up           // #6
