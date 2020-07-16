const router = require("express").Router();
const validator = require("../../../services/validator.service");
const creditCardsService = require("../../../services/credit-cards.srvice");

router.post("/", (req, res) => {
  if (
    validator.isValid(req.body).error ||
    !req.headers["merchant-identifier"]
  ) {
    res.sendStatus(400);
  } else {
    creditCardsService
      .chargeCreditCard(req.body)
      .catch(err => {
        res.status(400).send(err);
      })
      .then(result => {
        res.status(200).send(result);
      });
  }
});

module.exports = router;
