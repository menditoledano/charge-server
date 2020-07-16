const router = require("express").Router();
const chargeStatusesService = require("../../../services/charge-statuses.service");

router.get("/", (req, res) => {
  let reasons = chargeStatusesService.getReasonsByMerchant(req.headers.identifier)
  if(!!reasons){
    res.send(reasons.reasons);
  }
  else{
    res.send('No declined reasons found')
  }
});

module.exports = router;
