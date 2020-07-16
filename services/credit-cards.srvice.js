const request = require("requestretry");
const creditCardsOptions = require("../configurations/credit-cards-options");
const chargeStatusesService = require("../services/charge-statuses.service");
const errorMessage = { error: "Card declined" };
let delayTime = 2000;

async function chargeCreditCard(payload) {
  if (payload.creditCardCompany === creditCardsOptions.visa) {
    return callVisaApi(payload);
  } else if (payload.creditCardCompany === creditCardsOptions.masterCard) {
    return callMasterCardApi(payload);
  }
}

function callVisaApi(payload) {
  let headers = { identifier: getFirstName(payload.fullName) };
  let body = {
    fullName: payload.fullName,
    number: payload.creditCardNumber,
    expiration: payload.expirationDate,
    cvv: payload.cvv,
    totalAmount: payload.amount
  };

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://interview.riskxint.com/visa/api/chargeCard",
        form: body,
        headers: headers,
        method: "POST",
        maxAttempts: 3,
        retryDelay: delayTime,
        delayStrategy: increaseDelay(delayTime)
      },
      (error, response, body) => {
        if (!error) {
          body = JSON.parse(body);
          if (body["chargeResult"] === "Failure") {
            chargeStatusesService.newReason(
              payload.fullName,
              body["resultReason"]
            );
            resolve(errorMessage);
          } else if (body["chargeResult"] === "Success") {
            resolve();
          }
        } else {
          reject();
        }
      }
    );
  });
}

function callMasterCardApi(payload) {
  let headers = { identifier: getFirstName(payload.fullName) };
  let body = {
    first_name: getFirstName(payload.fullName),
    last_name: getLastName(payload.fullName),
    card_number: payload.creditCardNumber,
    expiration: payload.expirationDate,
    cvv: payload.cvv,
    charge_amount: payload.amount
  };

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://interview.riskxint.com/mastercard/capture_card",
        form: body,
        headers: headers,
        maxAttempts: 3,
        retryDelay: delayTime,
        delayStrategy: increaseDelay(delayTime),
        method: "POST"
      },
      (error, response, body) => {
        if (!error) {
          if (body === "OK") {
            resolve();
          } else if (JSON.parse(body).hasOwnProperty("error")) {
            reject();
          } else {
            resolve(errorMessage);

            chargeStatusesService.newReason(
              payload.fullName,
              JSON.parse(body)["declineReason"]
            );
          }
        } else {
          reject();
        }
      }
    );
  });
}

function getFirstName(fullName) {
  const splitedNames = fullName.split(" ");
  return splitedNames[0];
}

function getLastName(fullName) {
  const splitedNames = fullName.split(" ");
  return splitedNames[1];
}
function increaseDelay(delayTime) {
  delayTime *= 2;
  return delayTime;
}
module.exports = { chargeCreditCard };
