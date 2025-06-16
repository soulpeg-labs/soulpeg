// Contract addresses
export const SUSDC = process.env.NEXT_PUBLIC_STUSDC_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000"
export const USDC = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"

// Contract ABIs
export const SUSDC_ABI = [
  // Stake function
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "lockDays", type: "uint256" },
    ],
    name: "depositAndMint",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Unlock function
  {
    inputs: [],
    name: "unlock",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Check if user has unlocked
  {
    inputs: [{ name: "user", type: "address" }],
    name: "isUnlocked",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Get unlock timestamp
  {
    inputs: [{ name: "user", type: "address" }],
    name: "unlockAt",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Get remaining lock time
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getRemainingLockTime",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Get daily limit status
  {
    inputs: [],
    name: "getDailyLimitStatus",
    outputs: [
      { name: "currentAmount", type: "uint256" },
      { name: "maxAmount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export const USDC_ABI = [
  // Standard ERC20 balanceOf
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Standard ERC20 approve
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Standard ERC20 allowance
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]
