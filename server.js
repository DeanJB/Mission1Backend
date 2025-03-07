// Module imports
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/", upload.single("image"), async (req, res) => {
      if (!req.file) return res.status(400).json({ error: "No image has been uploaded" });
      try {
            const apiURL = process.env.CUSTOM_VISION_URL; // URL + Key in .env
            const apiKey = process.env.CUSTOM_VISION_KEY;

            const response = await axios.post(apiURL, req.file.buffer, {
                  headers: {
                        "Content-Type": "application/octet-stream",
                        "Prediction-Key": apiKey,
                  },
            });

            res.json({ prediction: response.data.predictions });
      } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Crystal ball said it failed" });
      }
});

// Server
app.listen(PORT, () => console.log(`Server running on port http://localhost:4000/`));
