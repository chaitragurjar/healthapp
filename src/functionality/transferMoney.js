// import patientData from '../data/patients.json' ;
// import hospitalData from '../data/hospitals.json';
const xrpl = require('xrpl');


const transferXRP = async (senderSecret, receiverAddress, amount) => {

  if (!senderSecret || !receiverAddress || parseFloat(amount) <= 0) {
    throw new Error("Invalid input: Ensure sender secret, receiver address, and a positive amount.");
  }

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const senderWallet = xrpl.Wallet.fromSeed(senderSecret);
  const prepared = await client.autofill({
    TransactionType: "Payment",
    Account: senderWallet.address,
    Amount: xrpl.xrpToDrops(amount),
    Destination: receiverAddress,
  });

  const signed = senderWallet.sign(prepared);
  const tx = await client.submitAndWait(signed.tx_blob);

  if (tx.result.meta.TransactionResult !== "tesSUCCESS") {
    throw new Error(`Transaction failed: ${tx.result.meta.TransactionResult}`);
  }

  client.disconnect();
  return signed.hash;
};

const transfer = async (customerID, hospitalID, amount) => {

    const response1 = await fetch('/patients.json');
    const patientData = await response1.json();

    const response2 = await fetch('/hospitals.json');
    const hospitalData = await response2.json();

  const customer = patientData.patients.find(patient => patient.patientID === customerID);
  if (!customer) throw new Error(`Customer with ID ${customerID} not found`);

  const hospital = hospitalData.hospitals.find(hospital => hospital.hospitalID === hospitalID);
  if (!hospital) throw new Error(`Hospital with ID ${hospitalID} not found`);

  return await transferXRP(customer.secret, hospital.address, amount);
};

export { transfer };