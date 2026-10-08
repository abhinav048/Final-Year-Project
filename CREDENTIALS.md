# 🌾 SeedSure — System Credentials & Role-Based Access Control (RBAC)

This document contains the official credentials for testing the **SeedSure** agricultural supply chain and Web3 escrow platform.

---

## 🔐 Security & Access Control Model

1. **Strict Single-Session Enforcement**:
   - Only **one role** is active at any time.
   - When you log in as **Farmer**, all Seller and CA privileges remain inactive and protected.
   - When you log in as **Seller (Breeder)**, you cannot access the Farmer portal or CA audit console.
   - When you log in as **CA Officer**, you cannot make farmer purchases or list breeder batches.

2. **Permanent Logout**:
   - Clicking **"Log out"** permanently clears the active session from `localStorage`.
   - Access to private portals (`/farmer`, `/seller`, `/admin`) is immediately blocked until you sign in again with valid credentials.
   - Unauthorized attempts to visit private portals trigger the **"Unauthorized Portal Access"** screen with options to switch accounts or return to your authorized portal.

---

## 📋 Credentials Directory

### 1. 🌾 Farmer (Kisan / Seed Buyer)
- **Role Name**: Farmer
- **Portal URL**: [`http://localhost:5173/farmer`](http://localhost:5173/farmer)
- **Full Name**: `Ramesh Patel (Kisan)`
- **Mobile Number / ID**: `+91 98765-43210`
- **Demo Passcode**: `seedsure123`
- **Ethereum Testnet Address**: `0x976EA74026E726554dB657fA54763abd0C3a0aa9`
- **Key Capabilities**:
  - Browse lab-certified seed batches in the marketplace
  - Deposit payments safely into smart escrow (`1 ETH ≈ ₹2,80,000 INR`)
  - Track delivery shipments and inspect physical seed bags
  - Confirm delivery & release funds to breeder
  - Raise fraud disputes to freeze escrow if seeds fail germination
- **Restricted From**:
  - ❌ Cannot access Breeder Hub (`/seller`)
  - ❌ Cannot access Certification Authority Console (`/admin`)

---

### 2. 🏢 Seed Breeder (Producer / Seller)
- **Role Name**: Seller (Breeder)
- **Portal URL**: [`http://localhost:5173/seller`](http://localhost:5173/seller)
- **Enterprise Name**: `AgriGrow Seed Breeders Ltd.`
- **Official Breeder Email**: `breeder@agrigrow.com`
- **Demo Passcode**: `seedsure123`
- **Ethereum Testnet Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Key Capabilities**:
  - Register new foundation and hybrid seed batches (Wheat, Mustard, Soybean, Paddy, Cotton)
  - Attach accredited lab test parameters (germination rate, vigor, purity, moisture)
  - Generate cryptographic QR tags and dispatch orders
  - Monitor AI Trust Reliability Score (0–100) and payout history
- **Restricted From**:
  - ❌ Cannot access Farmer Portal (`/farmer`)
  - ❌ Cannot access Certification Authority Console (`/admin`)

---

### 3. 🛡️ Certification Authority (CA / State Quality Officer)
- **Role Name**: Admin (CA Officer)
- **Portal URL**: [`http://localhost:5173/admin`](http://localhost:5173/admin)
- **Officer Name**: `Dr. K. Sharma (CA Officer)`
- **Govt Badge ID**: `CA-ICAR-OFFICER-771`
- **Official CA Email**: `officer@seedcert.gov.in`
- **Demo Passcode**: `seedsure123`
- **Ethereum Testnet Address**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Key Capabilities**:
  - Audit lab test certificates and verify SHA-256 fingerprints on Ethereum
  - Approve or revoke non-compliant seed lots
  - Arbitrate farmer/seller escrow disputes (full refund, release, or split)
  - Adjust smart contract trust gate safety thresholds
- **Restricted From**:
  - ❌ Cannot access Farmer Portal (`/farmer`)
  - ❌ Cannot access Breeder Hub (`/seller`)

---

## 🚀 How to Test Role Separation

1. Visit the **Sign In Page**: [`http://localhost:5173/login`](http://localhost:5173/login)
2. Use the credentials reference table or click **"Instant 1-Click Sign In"** for **Farmer**.
3. You will land on the **Farmer Portal** (`/farmer`).
4. Try manually navigating in your browser to [`http://localhost:5173/seller`](http://localhost:5173/seller):
   - You will see the **Unauthorized Portal Access** screen protecting the breeder workspace.
5. Click **"Log out"** in the top navbar:
   - Your session is permanently cleared.
   - Trying to open `/farmer`, `/seller`, or `/admin` will now redirect you straight to the login screen.
6. Sign in as **Breeder**:
   - You can now access `/seller`.
   - Trying to open `/farmer` or `/admin` is blocked.
