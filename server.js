const express = require("express");
const app = express();

app.use(express.json({ strict: false }));

function kakaoText(res, text) {
  return res.status(200).json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: String(text)
          }
        }
      ]
    }
  });
}

app.get("/", (req, res) => {
  res.send("Gamma calculator server is running");
});

app.get("/skill", (req, res) => {
  return kakaoText(res, "스킬 서버는 정상입니다. 카카오에서는 POST로 호출해야 계산됩니다.");
});

app.post("/skill", (req, res) => {
  const p = req.body?.action?.params || {};

  const weight = Number(p["체중"]);
  const gamma = Number(p["감마용량"]);
  const drugMg = Number(p["약물용량"]);
  const volumeMl = Number(p["총수액량"]);

  if (!weight || !gamma || !drugMg || !volumeMl) {
    return kakaoText(
      res,
      "계산에 필요한 값이 부족합니다.\n\n" +
      `체중: ${p["체중"] ?? "없음"}\n` +
      `감마용량: ${p["감마용량"] ?? "없음"}\n` +
      `약물용량: ${p["약물용량"] ?? "없음"}\n` +
      `총수액량: ${p["총수액량"] ?? "없음"}`
    );
  }

  const concentration = (drugMg * 1000) / volumeMl;
  const mlPerHr = (gamma * weight * 60) / concentration;

  return kakaoText(
    res,
    "감마 계산 결과\n\n" +
    `체중: ${weight} kg\n` +
    `목표 감마: ${gamma} mcg/kg/min\n` +
    `희석: ${drugMg} mg / ${volumeMl} mL\n\n` +
    `주입속도: ${mlPerHr.toFixed(2)} mL/hr`
  );
});

app.use((err, req, res, next) => {
  return kakaoText(res, "서버 오류가 발생했습니다. 입력값을 확인해주세요.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
