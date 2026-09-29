import express from 'express';
import auth from './routes/auth.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.get("/api/healthcheck", (req, res) => {
    res.json("true");
})

app.use("/api/auth", auth);

app.listen(port, () => {
    console.log(`API server started on port ${port}`);
})