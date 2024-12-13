import React, { useState } from "react";
import * as xrpl from "xrpl";

const XrpTransferWithForm = () => {
  const [status, setStatus] = useState("");
  const [senderSecret, setSenderSecret] = useState(""); // Sender Wallet Secret
  const [receiverAddress, setReceiverAddress] = useState(""); // Receiver Wallet Address
  const [amount, setAmount] = useState("10"); // Default amount
  const [transactionResult, setTransactionResult] = useState(null);

  const handleTransfer = async () => {
    setStatus("Processing...");
    try {
      // Validate inputs
      if (!senderSecret || !receiverAddress || parseFloat(amount) <= 0) {
        setStatus("Please provide valid input for all fields.");
        return;
      }

      // Connect to XRPL Testnet
      setStatus("Connecting to Testnet...");
      const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
      await client.connect();

      // Create wallet from sender secret
      const senderWallet = xrpl.Wallet.fromSeed(senderSecret);

      // Prepare transaction
      setStatus("Preparing transaction...");
      const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: senderWallet.address,
        Amount: xrpl.xrpToDrops(amount),
        Destination: receiverAddress,
      });

      // Sign and submit transaction
      setStatus("Signing and submitting transaction...");
      const signed = senderWallet.sign(prepared);
      const tx = await client.submitAndWait(signed.tx_blob);

      // Transaction result
      const result = tx.result.meta.TransactionResult;
      const balanceChanges = xrpl.getBalanceChanges(tx.result.meta);

      setTransactionResult({
        hash: signed.hash,
        result,
        balanceChanges,
      });

      // Disconnect
      client.disconnect();
      setStatus("Transaction completed successfully!");
    } catch (error) {
      console.error("Error during transaction:", error);
      setStatus("An error occurred. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>XRP Transfer</h2>
      <p>Status: {status}</p>
      <div style={{ marginBottom: "10px" }}>
        <label>Sender Secret:</label>
        <input
          type="text"
          value={senderSecret}
          onChange={(e) => setSenderSecret(e.target.value)}
          placeholder="Enter Sender Wallet Secret"
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Receiver Address:</label>
        <input
          type="text"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="Enter Receiver Wallet Address"
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Amount (XRP):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount to Transfer"
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>
      <button
        onClick={handleTransfer}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Submit Transaction
      </button>
      {transactionResult && (
        <div style={{ marginTop: "20px" }}>
          <h3>Transaction Details</h3>
          <p>Hash: {transactionResult.hash}</p>
          <p>Result: {transactionResult.result}</p>
          <pre>
            Balance Changes:{" "}
            {JSON.stringify(transactionResult.balanceChanges, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default XrpTransferWithForm;