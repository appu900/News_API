import express from "express";
import fileUpload from "express-fileupload";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 8000;

// * middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.send("Hello World");
});

//* importing routes for register user

import ApiRoutes from "./routes/api.js";
app.use("/api", ApiRoutes);





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
