const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const fs = require("fs"); // Import the file system module
const path = require("path"); // Import the path module
const app = express();
const mongoose = require("mongoose");
const food = require("./model/Order");

app.use(express.json());
app.use(cors());

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.genApi;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, html) => {
    if (err) {
      console.error("Error reading index.html:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(html);
  });
});

app.post("/", async (req, res) => {
  const { input } = await req.body;
  console.log(input);
  const parts = [
    { text: "input: can you order me a sandwich" },
    { text: 'output:{ "food": "sandwich", "quantity": 1 } ' },
  ];

  const result = await model.generateContent({
    contents: [
      { role: "user", parts },
      { role: "user", parts: [{ text: `input ${input}` }] },
    ],
  });
  user_request = await result.response.text();
  let match = user_request.match(/{.*}/);

  // If a match is found, parse it as a JSON object
  if (match) {
    user_request = JSON.parse(match[0]); // This will convert the string into an object
  }

  console.log(user_request.food);
  console.log(user_request.quantity);

  check_food = await food
    .findOne({
      food: user_request.food,
      quantity: { $gte: user_request.quantity },
    })
    .then((data) => {
      console.log("Food item found");
      res.json("Food item found");
    })
    .catch((e) => {
      console.log(e);
      res.json("Food item not found on the list");
    });
});

mongoose.connect(process.env.db).then(() => {
  console.log("connected to db");
  app.listen(process.env.port, () => {
    console.log(`server is running on port ${process.env.port}`);
  });
});
