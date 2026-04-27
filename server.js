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

  const p = body?.action?.params || {};
  const utterance = body?.userRequest?.utterance || "";

  let weight = Number(p["체중"]);
  let gamma = Number(p["감마용량"]);
  let drugMg = Number(p["약물용량"] || p["약물총량"]);
  let volumeMl = Number(p["총수액량"]);

  if (!weight || !gamma || !drugMg || !volumeMl) {
    const nums = utterance.match(/\d+(\.\d+)?/g) || [];
    weight = Number(nums[0]);
    gamma = Number(nums[1]);
    drugMg = Number(nums[2]);
    volumeMl = Number(nums[3]);
  }

  if (!weight || !gamma || !drugMg || !volumeMl) {
    return kakaoText(
      res,
      "값을 못 읽었습니다.\n\n" +
      `params: ${JSON.stringify(p)}\n` +
      `utterance: ${utterance}`
    );
  }

  const concentration = (drugMg * 1000) / volumeMl;
  const ccPerHr = (gamma * weight * 60) / concentration;

  return kakaoText(
    res,
    `감마 계산 결과\n\n` +
    `체중: ${weight} kg\n` +
    `감마: ${gamma} mcg/kg/min\n` +
    `희석: ${drugMg} mg / ${volumeMl} mL\n\n` +
    `주입속도: ${ccPerHr.toFixed(2)} cc/hr`
  );
});

app.listen(process.env.PORT || 3000);
