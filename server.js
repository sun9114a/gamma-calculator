const express = require("express");
const app = express();

app.use(express.text({ type: "*/*" }));

app.get("/", (req, res) => {
  res.status(200).send("Gamma calculator server is running");
});

app.get("/skill", (req, res) => {
  res.status(200).json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "GET /skill 정상"
          }
        }
      ]
    }
  });
});

app.post("/skill", (req, res) => {
  res.status(200).json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "POST /skill 정상"
          }
        }
      ]
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
