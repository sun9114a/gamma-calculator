const express = require("express");
const app = express();

app.use(express.text({ type: "*/*" }));

function kakaoText(res, text) {
  return res.status(200).json({
    version: "2.0",
    template: {
      outputs: [{ simpleText: { text: String(text) } }]
    }
  });
}

app.get("/", (req, res) => {
  res.send("Gamma calculator server is running");
});

app.post("/skill", (req, res) => {
  let body = {};

  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return kakaoText(res, "JSON 파싱 오류");
  }

  const utterance = body?.userRequest?.utterance || "";
  const nums = utterance.match(/\d+(\.\d+)?/g) || [];

  const weight = Number(nums[0]);
  const gamma = Number(nums[1]);
  const drugMg = Number(nums[2]);
  const volumeMl = Number(nums[3]);

  if (!weight || !gamma || !drugMg || !volumeMl) {
    return kakaoText(res, "예: 50kg 3mcg 800mg 500ml 처럼 입력해주세요.");
  }

  const concentration = (drugMg * 1000) / volumeMl;
  const ccPerHr = (gamma * weight * 60) / concentration;

  return kakaoText(
    res,
    `감마 계산 결과\n\n` +
    `입력: ${weight}kg, ${gamma}mcg/kg/min, ${drugMg}mg/${volumeMl}mL\n\n` +
    `주입속도: ${ccPerHr.toFixed(2)} mL/hr`
  );
});

app.listen(process.env.PORT || 3000);
