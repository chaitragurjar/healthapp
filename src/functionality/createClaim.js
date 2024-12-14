// import jsonData from "/claimStatus.json";
const saveToFile = async (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "claimStatus.json";
    link.click();
    URL.revokeObjectURL(url);
};

const updateJsonData = async (newEntry) => {

    const response = await fetch('/claimStatus.json');
    const jsonData = await response.json();
    try {
        const { patientID, policyID, claimProof, amount, status } = newEntry;
        if (!jsonData.claimStatus || !Array.isArray(jsonData.claimStatus)) {
            throw new Error("Invalid JSON structure: Missing 'claimStatus' array.");
        }
        if (!patientID || !policyID || !claimProof || !status || !amount) {
            throw new Error("Invalid entry: Ensure 'patientID', 'policyID', 'claimProof', and 'status' are provided.");
        }

        const existingIndex = jsonData.claimStatus.findIndex(entry => entry.claimProof === claimProof);

        if (existingIndex !== -1) {
            jsonData.claimStatus[existingIndex] = { ...jsonData.claimStatus[existingIndex], claimProof, status };
            console.log("Entry updated:", jsonData.claimStatus[existingIndex]);
        } else {
            jsonData.claimStatus.push(newEntry);
            console.log("New entry added:", newEntry);
        }
        saveToFile(jsonData);
        return jsonData;
    } catch (error) {
        console.error("Error updating JSON data:", error.message);
        throw error;
    }
};

export { updateJsonData };