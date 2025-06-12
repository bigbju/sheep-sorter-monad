// src/contractABI.js

export const CONTRACT_ADDRESS = "0x2f057a0e5d2d539161085f9aa665a46380869c39"; // твоя адреса контракту

export const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAll",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "internalType": "struct Leaderboard.Score[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLast",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "internalType": "struct Leaderboard.Score",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTopScores",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "internalType": "struct Leaderboard.Score[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "scores",
    "outputs": [
      { "internalType": "address", "name": "player", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
