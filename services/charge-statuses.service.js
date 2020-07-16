let data = [{ identifier: "123", reasons: [{ reason: "", count: 0 }] }];

function newReason(identifier, reason) {
  let currMerchant = data.find(curr => curr.identifier === identifier);
  if (!currMerchant) {
    let newMerchant = {
      identifier: identifier,
      reasons: [{ reason: reason, count: 1 }]
    };
    data.push(newMerchant);
  } else {
    let currReason = currMerchant.reasons.find(
      currReason => currReason.reason === reason
    );
    if (!currReason) {
      let newReason = { reason: reason, count: 1 };
      currMerchant.reasons.push(newReason);
    } else {
      currReason.count++;
    }
  }
}

function getReasonsByMerchant(identifier) {
  let merchantReasons = data.find(
    currMerchant => currMerchant.identifier === identifier
  );

  return merchantReasons;
}
module.exports = { newReason, getReasonsByMerchant };
