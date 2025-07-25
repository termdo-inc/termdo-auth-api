import express from "express";

// App
const app = express();

// Pre-Middlewares
app.use(express.json());

// Server
app.listen(3001, (): void => {
  console.log(`Server listening on port ${3001}...`);
});
