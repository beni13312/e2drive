import express from 'express';

const app = express();
const port = 3000;

app.get("/healthcheck", (req, res) => {
    res.json("true");
})

app.listen(port, () => {
    console.log(`API server started on port ${port}`);
})