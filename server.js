const express = require("express");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Load routes
app.use("/", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
