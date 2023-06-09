// import express from "express";
// import webhookRoute from "./src/routers/webhook.js";
const express= require("express")
const webhookRoute= require("./routers/webhook.js")
const app = express();

app.use(express.json())

app.use("/webhook",webhookRoute)
app.listen(process.env.PORT || 5000, ()=> {
    console.log(`Listening on port: ${process.env.PORT || 5000}`)
})