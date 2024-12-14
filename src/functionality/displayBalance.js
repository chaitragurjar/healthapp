async function displayStats() {
  try {
    const response = await fetch('/claimStatus.json');
    const data = await response.json();

    const policyApprovedAmounts = {};
    let totalApprovedAmount = 0;
    let totalRejectedAmount = 0;
    const approvedPatients = new Set();

    data.claimStatus.forEach(({ policyID, amount, status, patientID }) => {
      if (status === 'APPROVED') {
        policyApprovedAmounts[policyID] = (policyApprovedAmounts[policyID] || 0) + amount;
        totalApprovedAmount += amount;
        approvedPatients.add(patientID);
      } else if (status === 'REJECTED') {
        totalRejectedAmount += amount;
      }
    });

    var value =  {
      policyApprovedAmounts,
      totalApprovedAmount,
      totalRejectedAmount,
      totalApprovedPatients: approvedPatients.size
    };
    return value;
  } catch (error) {
    throw new Error("Error fetching or processing claim status data: " + error.message);
  }
}

export { displayStats };
