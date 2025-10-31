const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const corsOptions = require("./cors/cors");

dotenv.config();
connectDB();

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Server setup is completed" });
});

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
