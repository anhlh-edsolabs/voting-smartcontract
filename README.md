# Solana Creator Vault Launchpad

A Solana program that enables creators to launch tokens by raising initial capital from backers. Funds are locked in a smart contract vault and used to provide token liquidity and/or fuel creator-led activities.

## Features

- **Token Creation**: Creators can specify token details (name, symbol, image, supply)
- **Funding Goals**: Set a specific amount of SOL to raise
- **Pitch**: Create a personal pitch or intent statement to attract backers
- **Secure Vaults**: Funds are locked in a smart contract vault
- **Proportional Distribution**: Tokens are distributed proportionally to contributors
- **Refund Protection**: If funding goal is not met, contributors get refunds
- **Liquidity Locks**: Smart contract enforces lock period and vesting

## Optional Settings

- Token supply cap
- Lock duration and vesting schedules (pre-configured templates)
- Creator tier (verified/unverified)

## Program Structure

The Creator Vault Launchpad consists of the following key components:

- **Vault Account**: Stores token and funding details
- **Contribution Accounts**: Records each backer's contribution
- **Token Mint**: Created when funding goal is reached

## Instructions

1. `initialize_vault`: Creates a new token vault with creator-specified parameters
2. `contribute`: Allows backers to fund a vault
3. `finalize_vault`: Closes funding and either creates tokens or enables refunds
4. `distribute_tokens`: Mints and distributes tokens to contributors
5. `refund`: Returns funds to contributors if funding goal is not met
6. `withdraw_funds`: Allows creators to withdraw funds according to vesting schedule

## Security Measures

- **Lock Periods**: Funds cannot be withdrawn immediately
- **Vesting Schedules**: Gradual release of funds to prevent exit scams
- **PDA-based Vault**: Secure fund storage with program-derived authority
- **Verification System**: Optional creator verification tier

## Getting Started

To build and test the program:

```bash
# Build the program
anchor build

# Test the program
anchor test
```
