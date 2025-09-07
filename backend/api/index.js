const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { connectDB } = require("./config/database");
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.send("Server is running"));




if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
