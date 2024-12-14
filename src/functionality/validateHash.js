// import exp from 'constants';

const xrpl = require('xrpl');

const validateTransaction = async (transactionHash, expectedSender, expectedReceiver, amt) => {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  try {
    const response1 = await fetch('/patients.json');
    const patientData = await response1.json();

    const response2 = await fetch('/hospitals.json');
    const hospitalData = await response2.json();
    
    const expectedSenderAddress = patientData.patients.find(patient => patient.patientID === expectedSender).address;
    const expectedReceiverAddress = hospitalData.hospitals.find(hospital => hospital.hospitalID === expectedReceiver).address;
    await client.connect();

    const transaction = await client.request({
      command: "tx",
      transaction: transactionHash,
    });
    const sender = transaction.result.tx_json.Account;
    const receiver = transaction.result.tx_json.Destination;
    const amount = transaction.result.tx_json.DeliverMax;  // in integer

    const isValid = sender === expectedSenderAddress && receiver === expectedReceiverAddress && amount === xrpl.xrpToDrops(amt);

    await client.disconnect();

    return isValid;
  } catch (error) {
    console.error("Error validating transaction:", error.message);
    await client.disconnect();
    return false;
    // throw error;
  }
};

export { validateTransaction };