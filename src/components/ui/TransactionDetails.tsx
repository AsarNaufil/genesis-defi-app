/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import React, { useState } from "react";

interface TransactionDetailsProps {
  transaction: ethers.providers.TransactionResponse;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div>
      <button onClick={toggleDetails} className="text-blue-500 dark:text-blue-400 underline cursor-pointer">
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="border border-gray-300 dark:border-gray-700 rounded p-4 mt-2">
          <h3 className="text-lg font-semibold mb-2">Transaction Details:</h3>
          <ul>
            <li><strong>To:</strong> {transaction.to}</li>
            <li><strong>From:</strong> {transaction.from}</li>
            {
              // TODO: Use contract address from constants
              // TODO: Use Ellipsis to shorten everything
            }
            <li><strong>Contract Address:</strong> {transaction.contractAddress || "N/A"}</li>
            <li><strong>Gas Used:</strong> {parseInt((transaction as any).gasUsed._hex, 16)}</li>
            <li><strong>Block Hash:</strong> {transaction.blockHash}</li>
            <li><strong>Transaction Hash:</strong> {(transaction as any).transactionHash}</li>
            <li><strong>Block Number:</strong> {transaction.blockNumber}</li>
            <li><strong>Confirmations:</strong> {transaction.confirmations}</li>
            <li><strong>Cumulative Gas Used:</strong> {parseInt((transaction as any).cumulativeGasUsed._hex, 16)}</li>
            <li><strong>Effective Gas Price:</strong> {parseInt((transaction as any).effectiveGasPrice._hex, 16)}</li>
            <li><strong>Type:</strong> {transaction.type}</li>
            <li><strong>Byzantium:</strong> {(transaction.byzantium.toString() ? 'Yes' : 'No')}</li>
            <li><strong>Events:</strong></li>
            <ul>
              {transaction.events.map((event, index) => (
                <li key={index}>
                  <h4 className="text-md font-semibold">Event Information:</h4>
                  <ul>
                    <li><strong>Transaction Index:</strong> {event.transactionIndex}</li>
                    <li><strong>Block Number:</strong> {event.blockNumber}</li>
                    <li><strong>Transaction Hash:</strong> {event.transactionHash}</li>
                    <li><strong>Address:</strong> {event.address}</li>
                    <li><strong>Data:</strong> {event.data}</li>
                    <li><strong>Log Index:</strong> {event.logIndex}</li>
                    <li><strong>Block Hash:</strong> {event.blockHash}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
