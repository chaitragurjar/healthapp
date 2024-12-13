#!/bin/bash

# Loop every 10 seconds within a minute
for i in {1..6}
do
  # Move the file
  mv /home/chaitra/healthinsurance/healthapp/public/claimStatus\ \(1\).json /home/chaitra/healthinsurance/healthapp/public/claimStatus.json
  
  # Wait for 10 seconds
  sleep 10
done