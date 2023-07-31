const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const app = express(); // Create an Express app

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable JSON parsing for request bodies

// app.post("/robominds", async (req, res) => {
//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: req.body.content }],
//       }),
//     });

//     const data = await response.json();
//     res.status(200).json({ msg: data.choices[0].message.content })
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(400).json({ msg: "Error occurred while generating" })
//   }
// });

app.post("/robominds", async (req, res) => {
  try {
    const response = await axios.post(API_URL, {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.content }],
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
    });

    const data = response.data;
    res.status(200).json({ msg: data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ msg: "Error occurred while generating" });
  }
});


// Import database connection configuration
const Connection = require("./Configs/db");
app.listen(process.env.PORT, Connection()); // Start the server and listen on port, establishing a database connection
