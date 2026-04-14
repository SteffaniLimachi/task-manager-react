const express = require("express");

const app = express();
const PORT = 3000;

let tasks = [
    {id:1, title: "Study Express", completed: false},
    {id:2, title: "Build backend", completed: false},
]

app.get("/", (req: any, res: any) => {
    res.send("Backend is working!");
});

app.get("/tasks", (req: any, res: any) => {
    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});