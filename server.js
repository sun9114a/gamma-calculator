const express = require("express");
const app = express();

app.use(express.json());

app.post("/skill", (req, res) => {
  const p = req.body?.action?.params || {};

  const weight = Number(p["체중"]);
  const gamma = Number(p["감마용량"]);
  const drugMg = Number(p["약물용량"]);
  const volumeMl = Number(p["총수액량"]);

  if (!weight || !gamma || !drugMg || !volumeMl) {
    return res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "계산에 필요한 값이 부족합니다.\n예: 60kg 5감마 400mg 250ml"
            }
          }
        ]
      }
    });
  }

  const concentration = (drugMg * 1000) / volumeMl;
  const mlPerHr = (gamma * weight * 60) / concentration;

  res.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text:
              `감마 계산 결과\n\n` +
              `체중: ${weight} kg\n` +
              `목표 감마: ${gamma} mcg/kg/min\n` +
              `희석: ${drugMg} mg / ${volumeMl} mL\n\n` +
              `주입속도: ${mlPerHr.toFixed(2)} mL/hr\n\n` +
              `※ 실제 투여 전 처방과 병원 프로토콜을 확인하세요.`
          }
        }
      ]
    }
  });
});

app.get("/", (req, res) => {
  res.send("Gamma calculator server is running");
});

app.listen(process.env.PORT || 3000);
