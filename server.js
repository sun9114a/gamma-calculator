app.post("/reverse-skill", (req, res) => {
  let body = {};

  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return kakaoText(res, "JSON 파싱 오류");
  }

  const p = body?.action?.params || {};
  const utterance = body?.userRequest?.utterance || "";

  let weight = Number(p["체중"]);
  let ccPerHr = Number(p["주입속도"]);
  let drugMg = Number(p["약물용량"] || p["약물총량"]);
  let volumeMl = Number(p["총수액량"]);

  if (!weight || !ccPerHr || !drugMg || !volumeMl) {
    const nums = utterance.match(/\d+(\.\d+)?/g) || [];
    weight = Number(nums[0]);
    ccPerHr = Number(nums[1]);
    drugMg = Number(nums[2]);
    volumeMl = Number(nums[3]);
  }

  if (!weight || !ccPerHr || !drugMg || !volumeMl) {
    return kakaoText(res, "예: 50kg 3cc 800mg 500ml 처럼 입력해주세요.");
  }

  const concentration = (drugMg * 1000) / volumeMl;
  const gamma = (ccPerHr * concentration) / weight / 60;

  return kakaoText(
    res,
    `감마 환산 결과\n\n` +
    `체중: ${weight} kg\n` +
    `주입속도: ${ccPerHr} cc/hr\n` +
    `희석: ${drugMg} mg / ${volumeMl} mL\n\n` +
    `환산 감마: ${gamma.toFixed(2)} mcg/kg/min`
  );
});
