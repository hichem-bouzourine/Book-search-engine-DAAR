require("dotenv").config();
const express = require("express");
const cors = require("cors");
const IndexedBooks = require("./routes/bookController");

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/books", IndexedBooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
