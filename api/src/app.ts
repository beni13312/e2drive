import express from 'express';
import auth from './routes/auth.js';
import files from './routes/files.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import validateSession from "./middlewares/validateSession.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// public endpoints
app.get("/api/healthcheck", (req, res) => {
    return res.json({healthcheck: true});
})
app.use("/api/auth", auth);
app.use("/api", validateSession);

// authenticated endpoints
app.use("/api/files", files);

app.listen(port, () => {
    console.log(`API server started on port ${port}`);
})