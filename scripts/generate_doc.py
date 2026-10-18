import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Set standard margins (1 inch)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

    # Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("SeedSure: Smart Contract-Based Seed Quality & Seller Trust Platform")
    run_title.font.name = 'Calibri'
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x06, 0x5F, 0x46) # Emerald green

    # Subtitle
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(14)
    run_sub = sub_p.add_run("Comprehensive Technical Architecture, Blockchain Smart Contract Suite, Backend Engine, and Working Specification")
    run_sub.font.size = Pt(13)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)

    # Metadata Box
    meta_table = doc.add_table(rows=1, cols=1)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_cell = meta_table.cell(0, 0)
    set_cell_background(meta_cell, "F0FDF4") # Light emerald tint
    set_cell_margins(meta_cell, top=140, bottom=140, left=200, right=200)
    meta_p = meta_cell.paragraphs[0]
    meta_p.paragraph_format.space_after = Pt(2)
    meta_run = meta_p.add_run("Target: Academic Final Year Project & IEEE Research Publication  |  Document Version: 1.0.0  |  Local Node / Hardhat / EVM Ready")
    meta_run.font.size = Pt(9.5)
    meta_run.font.bold = True
    meta_run.font.color.rgb = RGBColor(0x04, 0x78, 0x57)

    doc.add_paragraph() # Spacing

    # Helper for Headings
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(18)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x06, 0x5F, 0x46)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A) # Deep Navy
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
        return p

    def add_callout(text, bg_hex="F8FAFC", border_color="0284C7"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.size = Pt(10)
        r.font.italic = True
        r.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        doc.add_paragraph()

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # =========================================================================
    add_h1("1. Executive Summary & Problem Context")
    
    p = doc.add_paragraph(
        "Counterfeit, unviable, and adulterated seed distribution represents a critical vulnerability in global agriculture, "
        "causing devastating yield losses of up to 30% in developing and agrarian nations. The existing supply chain relies on "
        "paper laboratory certificates (e.g., ISTA, ICAR, state seed testing stations) that are easily forged, altered, or duplicated. "
        "Furthermore, existing blockchain agricultural tracking systems focus almost exclusively on post-harvest 'farm-to-fork' logistics, "
        "leaving farmers completely unprotected at the most critical juncture: the point of seed purchase."
    )
    p.paragraph_format.space_after = Pt(8)

    add_callout(
        "Key Research Insight: A farmer who buys unviable seeds discovers the deception 30 to 60 days later when germination fails. "
        "By then, the planting window is lost, capital is destroyed, and legal recourse is practically non-existent. "
        "SeedSure acts before and during purchase to eliminate this vulnerability.",
        bg_hex="FEF3C7"
    )

    p = doc.add_paragraph(
        "SeedSure resolves this systemic market failure by integrating three core innovations into a unified platform:\n"
        "1. Cryptographic Tamper-Proof Lab Records: Every certified seed lot is anchored to an immutable SHA-256 hash of its laboratory analysis on the Ethereum blockchain, verified by accredited Certification Authorities.\n"
        "2. Dynamic ML-Driven Seller Trust Scoring: An off-chain machine learning oracle computes dynamic, multi-factor credibility ratings based on actual transaction fulfillment, certification ratios, and Bayesian ratings, anchored on-chain with a canonical featuresHash.\n"
        "3. Non-Custodial Smart Contract Escrow with Automated Gating: Farmer funds are held safely in a decentralized smart contract during shipping, released only upon physical delivery confirmation. An automated Farmer Safety Gate programmatically blocks purchases from sellers whose trust score drops below safety thresholds (< 40/100)."
    )
    p.paragraph_format.space_after = Pt(8)

    # =========================================================================
    # SECTION 2: COMPLETE SYSTEM ARCHITECTURE & TOPOLOGY
    # =========================================================================
    add_h1("2. System Architecture & Topology")
    
    p = doc.add_paragraph(
        "SeedSure implements a modern, decoupled hybrid Web3 architecture spanning four specialized layers. "
        "This design combines the trustless execution and cryptographic immutability of blockchain smart contracts "
        "with the sub-millisecond query performance of an indexed relational database cache."
    )
    p.paragraph_format.space_after = Pt(8)

    # Architecture Diagram in Monospace Box
    arch_table = doc.add_table(rows=1, cols=1)
    arch_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    arch_cell = arch_table.cell(0, 0)
    set_cell_background(arch_cell, "F1F5F9")
    set_cell_margins(arch_cell, top=120, bottom=120, left=140, right=140)
    arch_p = arch_cell.paragraphs[0]
    arch_p.paragraph_format.space_after = Pt(0)
    arch_code = (
        "+--------------------------------------------------------------------------------+\n"
        "|                             CLIENT APPLICATION (React SPA)                    |\n"
        "|  - Certified Marketplace  - Quality Spec Sheet  - Interactive Tamper Check     |\n"
        "|  - Farmer Escrow Portal   - Seller Hub          - CA Certifier Console         |\n"
        "+---------------------------------------+----------------------------------------+\n"
        "                                        | REST API & Ethers.js RPC\n"
        "                                        v\n"
        "+--------------------------------------------------------------------------------+\n"
        "|                        BACKEND & CACHING TIER (Node.js/Express)                |\n"
        "|  - RESTful API Service (/api/seeds, /api/sellers, /api/orders, /api/feedback)  |\n"
        "|  - Rebuildable SQLite Database (better-sqlite3 in WAL Mode)                    |\n"
        "|  - Dual-Mode Blockchain Adapter (Live EVM Hardhat Node <-> In-Memory Ledger)   |\n"
        "|  - Off-Chain ML Dynamic Scorer (5-Factor Model + Exponential Recency Decay)    |\n"
        "+---------------------------------------+----------------------------------------+\n"
        "                                        | Writes Score + featuresHash\n"
        "                                        v\n"
        "+--------------------------------------------------------------------------------+\n"
        "|                     BLOCKCHAIN & SMART CONTRACTS (EVM / Hardhat)               |\n"
        "|  1. SellerRegistry.sol    : Breeder Identity, Accreditation & Order Metrics    |\n"
        "|  2. SeedRegistry.sol      : Batch Quality Specs & SHA-256 Certificate Hashes   |\n"
        "|  3. TrustScoreRegistry.sol: Dynamic Trust Ratings & featuresHash Audit Vector  |\n"
        "|  4. Marketplace.sol       : Non-Custodial Escrow Vault & Automated Safety Gate |\n"
        "|  5. FeedbackRegistry.sol  : Sybil-Resistant Verified Review Ledger             |\n"
        "+---------------------------------------+----------------------------------------+\n"
        "                                        | Content CIDs (Qm...)\n"
        "                                        v\n"
        "+--------------------------------------------------------------------------------+\n"
        "|                        DECENTRALIZED STORAGE (IPFS)                            |\n"
        "|  - Lab Certificates (PDF) - Breeder Licensing - Physical Seed Bag QR Tags      |\n"
        "+--------------------------------------------------------------------------------+"
    )
    r = arch_p.add_run(arch_code)
    r.font.name = 'Courier New'
    r.font.size = Pt(8.5)
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph() # Spacing

    # =========================================================================
    # SECTION 3: BLOCKCHAIN ARCHITECTURE & SMART CONTRACT SUITE
    # =========================================================================
    add_h1("3. Blockchain Architecture & Smart Contract Layer")

    p = doc.add_paragraph(
        "The smart contract suite is deployed on the Ethereum Virtual Machine (EVM) using Solidity version ^0.8.24 "
        "and OpenZeppelin Contracts v5. It consists of 5 modular, interacting smart contracts that enforce trust, "
        "custody, verification, and governance without requiring centralized trusted intermediaries."
    )
    p.paragraph_format.space_after = Pt(8)

    # Contract Table
    add_h2("3.1 Smart Contract Summary & Responsibilities")
    tbl = doc.add_table(rows=6, cols=3)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Contract Name", "Core Responsibility", "Key Roles & Access Control"]
    for i, h in enumerate(headers):
        cell = tbl.cell(0, i)
        set_cell_background(cell, "065F46")
        set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    contract_data = [
        ("SellerRegistry.sol", "Maintains breeder identity, licensing credentials (IPFS CID), verification status, operational metrics, and governance suspension.", "DEFAULT_ADMIN_ROLE, CERTIFIER_ROLE, MARKETPLACE_ROLE"),
        ("SeedRegistry.sol", "Digital twin of seed lots; stores physical quality parameters (germination %, purity, vigor, moisture), SHA-256 certificate hashes, and certification state.", "DEFAULT_ADMIN_ROLE, CERTIFIER_ROLE, MARKETPLACE_ROLE"),
        ("TrustScoreRegistry.sol", "Stores dynamic ML-computed seller ratings (0-100), risk tiers, and canonical featuresHash for cryptographic auditability.", "DEFAULT_ADMIN_ROLE, ORACLE_ROLE"),
        ("Marketplace.sol", "Non-custodial smart contract escrow vault locking buyer ETH during transit. Enforces automated farmer protection gating against low-trust sellers.", "DEFAULT_ADMIN_ROLE, DISPUTE_RESOLVER_ROLE, ReentrancyGuard"),
        ("FeedbackRegistry.sol", "Immutable farmer review ledger tied strictly to completed escrow orders, eliminating fake review spam and Sybil attacks.", "IMarketplace Integration (Order status validation)")
    ]

    for row_idx, data in enumerate(contract_data, start=1):
        bg = "F9FAFB" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = tbl.cell(row_idx, col_idx)
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(9.5)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    doc.add_paragraph() # Spacing

    add_h2("3.2 Deep Dive into Individual Smart Contracts")

    add_h3("A. SellerRegistry.sol (Breeder Identity & Operational History)")
    doc.add_paragraph(
        "SellerRegistry manages the onboarding, vetting, and performance tracking of seed producers. "
        "When an accredited agency inspects a breeder's physical facilities, it invokes verifySeller(sellerAddress) using CERTIFIER_ROLE. "
        "The contract also exposes callback methods callable exclusively by Marketplace.sol: recordOrderPlaced(), recordOrderDelivered(), "
        "recordOrderDisputed(), and recordDisputeResolved(). This ensures that seller performance metrics (total orders, on-time deliveries, "
        "disputes lost) are recorded immutably on-chain and cannot be manipulated off-chain."
    )

    add_h3("B. SeedRegistry.sol (Seed Lot Quality & Lab Certificate Hashing)")
    doc.add_paragraph(
        "SeedRegistry stores the core biochemical and agricultural metrics for each seed lot: germination rate, purity, vigor index, "
        "moisture percentage, and genetic disease resistance markers. Crucially, it stores bytes32 certificateHash, which is the SHA-256 "
        "hash of the official laboratory certificate PDF. A mapping mapping(bytes32 => bool) ensures that no certificate hash can ever "
        "be registered twice, preventing certificate reuse across uncertified lots. A batch transitions from Pending to Certified only when "
        "an authorized certifier calls certifyBatch(batchId)."
    )

    add_h3("C. TrustScoreRegistry.sol (Decentralized Dynamic ML Oracle)")
    doc.add_paragraph(
        "TrustScoreRegistry receives dynamic credibility scores from the authorized ORACLE_ROLE. To guarantee research transparency and prevent "
        "oracle manipulation, every update stores score (0-100), riskCategory, modelVersion, and bytes32 featuresHash. "
        "The contract provides the meetsTrustThreshold(address seller, uint8 minScore) function, which is queried synchronously by "
        "Marketplace.sol to protect farmers from buying from unaccredited or low-rated suppliers."
    )

    add_h3("D. Marketplace.sol (Non-Custodial Escrow & Farmer Protection Gate)")
    doc.add_paragraph(
        "Marketplace manages the commercial lifecycle of seed purchases. When a farmer creates an order, the purchase amount in ETH is "
        "held directly inside the smart contract's balance. Before accepting payment, the contract verifies:\n"
        "1. That the seller is active and not suspended in SellerRegistry.\n"
        "2. That the batch has sufficient inventory in SeedRegistry.\n"
        "3. That the seller meets the minimum trust threshold in TrustScoreRegistry: meetsTrustThreshold(batch.seller, minTrustScore).\n"
        "If the seller's score is below the threshold (< 40), the EVM execution immediately reverts, protecting the farmer from fraud. "
        "Funds are released to the seller only when the buyer calls confirmDelivery(orderId). In case of damaged bags or fake seeds, "
        "the buyer can trigger disputeOrder(), freezing funds until resolved by an arbiter."
    )

    add_h3("E. FeedbackRegistry.sol (Sybil-Resistant Review Ledger)")
    doc.add_paragraph(
        "To prevent fake review inflation (a ubiquitous problem in Web2 marketplaces), FeedbackRegistry enforces that:\n"
        "1. The submitter is msg.sender == order.buyer.\n"
        "2. The order has reached status == 2 (COMPLETED) in Marketplace.sol.\n"
        "3. Only one feedback submission is allowed per order ID.\n"
        "This cryptographically ties every star rating (1 to 5) to a real, delivered agricultural transaction."
    )

    # =========================================================================
    # SECTION 4: BACKEND ARCHITECTURE & CACHING LAYER
    # =========================================================================
    add_h1("4. Backend Architecture & High-Performance Cache Layer")

    p = doc.add_paragraph(
        "The SeedSure backend is implemented in Node.js, Express, and TypeScript. "
        "It acts as a high-performance query engine and rebuildable cache for the blockchain, "
        "enabling instantaneous full-text searches, multi-parameter filtering, and real-time ML score calculation."
    )
    p.paragraph_format.space_after = Pt(8)

    add_h2("4.1 Database Design: better-sqlite3 with WAL Mode")
    doc.add_paragraph(
        "Rather than incurring the latency and operational overhead of an external database cluster, SeedSure utilizes better-sqlite3. "
        "Configured with Write-Ahead Logging (WAL) and memory caching, it executes synchronous C++ queries within the Node process, "
        "delivering sub-millisecond query execution (< 0.5 ms). The database is strictly designed as a rebuildable cache: if the database "
        "file is deleted, the backend can completely reconstruct all state by replaying on-chain smart contract events."
    )

    # Database Schema Summary
    db_tbl = doc.add_table(rows=7, cols=3)
    db_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    db_headers = ["Table Name", "Primary Purpose", "Key Fields & Constraints"]
    for i, h in enumerate(db_headers):
        cell = db_tbl.cell(0, i)
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    schema_data = [
        ("sellers", "Mirrors on-chain breeder accounts and cached metrics", "address (PK), name, isVerified, isSuspended, trustScore, riskCategory, order metrics"),
        ("seeds", "Seed batch catalog, quality specifications, and hash roots", "id (PK), sellerAddress (FK), batchNumber (UNIQUE), germinationRate, purity, certificateHash, status"),
        ("orders", "Tracks escrow purchases, courier waybills, and financial status", "id (PK), batchId (FK), buyerAddress, sellerAddress, status, trackingNumber, escrowLocked"),
        ("feedback", "Verified farmer ratings and commentary CIDs", "id (PK), orderId (FK UNIQUE), sellerAddress, rating (1-5), commentCID"),
        ("disputes", "Arbitration filings, evidence hashes, and resolutions", "id (PK), orderId (FK UNIQUE), buyerAddress, reason, evidenceHash, status"),
        ("trust_score_history", "Complete audit trail of ML feature vectors and generated hashes", "id (PK), sellerAddress, score, riskCategory, modelVersion, featuresHash, featuresJson")
    ]

    for row_idx, data in enumerate(schema_data, start=1):
        bg = "F9FAFB" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = db_tbl.cell(row_idx, col_idx)
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(9.5)
            if col_idx == 0:
                r.font.bold = True

    doc.add_paragraph() # Spacing

    add_h2("4.2 Dual-Mode Blockchain Integration Service")
    doc.add_paragraph(
        "To ensure continuous availability during demonstrations, development, and remote evaluation, "
        "the backend features a Dual-Mode Blockchain Service (blockchain.ts). "
        "When a local Hardhat RPC or Anvil node is active at http://127.0.0.1:8545, it communicates directly with live smart contracts. "
        "If no EVM node is reachable, the service transparently shifts to an EVM simulation mode with an in-memory session transaction ledger, "
        "ensuring the frontend and API remain 100% functional without throwing unhandled connection errors."
    )

    # =========================================================================
    # SECTION 5: OFF-CHAIN MACHINE LEARNING TRUST SCORING ENGINE
    # =========================================================================
    add_h1("5. Off-Chain Dynamic ML Trust Scoring Engine")

    p = doc.add_paragraph(
        "The SeedSure trust evaluation engine represents a significant departure from static badge systems. "
        "It applies a multi-factor mathematical formulation with exponential recency decay to objectively measure "
        "breeder reliability over time."
    )
    p.paragraph_format.space_after = Pt(8)

    add_h2("5.1 Mathematical Formulation")
    doc.add_paragraph(
        "The composite trust score S in [0, 100] is calculated across five core dimensions:\n"
        "S = ( 0.25 * Scert + 0.25 * Sdelivery + 0.20 * Ssuccess + 0.15 * Srating + 0.15 * Sdispute ) * Wrecency"
    )

    # Factor Explanations
    factors = [
        ("1. Lab Certification Ratio (Scert, Weight: 25%)", "Scert = (Certified Batches / Total Batches) * 100. Measures seller's commitment to independent laboratory validation."),
        ("2. On-Time Delivery Rate (Sdelivery, Weight: 25%)", "Sdelivery = max(0, (Delivered Orders - 0.5 * Delayed Orders) / Total Orders) * 100. Penalizes late shipments that jeopardize seasonal planting windows."),
        ("3. Transaction Success Rate (Ssuccess, Weight: 20%)", "Ssuccess = (Successful Orders / Total Orders) * 100. Measures baseline commercial reliability and order completion."),
        ("4. Bayesian Farmer Rating (Srating, Weight: 15%)", "R_Bayes = (R_avg * n + 3.5 * 3) / (n + 3). Applies an empirical Bayesian prior (mu=3.5, k=3) to prevent new sellers with a single 5-star review from unfairly outranking seasoned breeders."),
        ("5. Dispute Penalty Rate (Sdispute, Weight: 15%)", "Sdispute = max(0, 100 - (2.0 * Disputes Lost + 0.5 * Disputed Orders) / Total Orders * 100). Imposes heavy penalties on sellers who lose arbitration cases."),
        ("6. Exponential Recency Decay (Wrecency)", "Wrecency = 0.90 + 0.10 * exp( - (ln 2 / 90) * delta_t_days ). Inactive breeders experience a gradual credibility decay with a half-life of 90 days, bounded between 0.90 and 1.00.")
    ]

    for title, desc in factors:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(title + ": ")
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(0x06, 0x5F, 0x46)
        r2 = p.add_run(desc)
        r2.font.size = Pt(10.5)

    add_h2("5.2 Cryptographic Auditability: The featuresHash Commitment")
    doc.add_paragraph(
        "To prevent oracle corruption, the ML service produces a canonical JSON representation of the exact feature inputs:\n"
        "featuresHash = SHA256(canonicalJSON(sellerFeatures))\n"
        "This 32-byte hash is committed directly to TrustScoreRegistry on-chain. Any third-party researcher or evaluator can query "
        "GET /api/ml/verify/:seller/:updateId, which re-hashes the raw transaction features and verifies that the recorded hash matches "
        "with 100% bitwise parity."
    )

    # =========================================================================
    # SECTION 6: CRYPTOGRAPHIC TAMPER-PROOF VERIFICATION
    # =========================================================================
    add_h1("6. Cryptographic Tamper-Proof Verification Pipeline")

    p = doc.add_paragraph(
        "A foundational contribution of SeedSure is replacing forgeable paper seed certificates with "
        "client-side verifiable cryptographic fingerprints."
    )
    p.paragraph_format.space_after = Pt(8)

    doc.add_paragraph(
        "Step 1: When a seed batch is registered, the official lab certificate PDF is ingested. Its SHA-256 digest is computed:\n"
        "certificateHash = SHA256(document_bytes)\n\n"
        "Step 2: The hash is permanently written to SeedRegistry.sol, and the PDF is stored on IPFS with content identifier certificateCID.\n\n"
        "Step 3: When a farmer scans the QR code on a physical seed bag or inspects a batch on the marketplace, the client application "
        "downloads the raw PDF bytes from the IPFS gateway and computes crypto.subtle.digest('SHA-256', fileData) directly inside the browser.\n\n"
        "Step 4: The computed hash is compared against the smart contract record:\n"
        "- If hashes match: Platform displays 'TAMPER CHECK: PASS' with green verified badge.\n"
        "- If even a single character or byte has been edited: The SHA-256 avalanche effect flips over 50% of the bits, resulting in an immediate 'TAMPER CHECK: FAIL (FORGERY DETECTED)' warning."
    )

    # =========================================================================
    # SECTION 7: COMPARATIVE TECHNOLOGY MATRIX ("WHAT IS USED AND WHY")
    # =========================================================================
    add_h1("7. Comparative Technology Evaluation Matrix ('What is Used and Why')")

    comp_tbl = doc.add_table(rows=7, cols=4)
    comp_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    comp_headers = ["Component", "Technology Chosen", "Alternatives Evaluated", "Why It Was Used (Decisive Rationale)"]
    for i, h in enumerate(comp_headers):
        cell = comp_tbl.cell(0, i)
        set_cell_background(cell, "065F46")
        set_cell_margins(cell, top=120, bottom=120, left=100, right=100)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    comp_data = [
        ("Smart Contract Platform", "Solidity ^0.8.24 on EVM", "Rust (Solana) / Hyperledger Fabric", "Solidity with OpenZeppelin provides the most mature financial security primitives, native checked arithmetic, and universal wallet support for rural web applications."),
        ("Escrow Settlement", "Non-Custodial Smart Contract Escrow", "Centralized Payment Gateways (Stripe, Razorpay)", "Centralized gateways charge high transaction fees (2-3%), can unilaterally freeze agricultural funds, and lack automated trust-gate integration."),
        ("Trust Score Storage", "Off-chain ML with on-chain featuresHash", "Fully On-Chain ML / Centralized Credit API", "On-chain exponential decay and Bayesian float math is gas-prohibitive. Off-chain computation with on-chain featuresHash guarantees 100% auditability with zero gas overhead."),
        ("Database Caching", "better-sqlite3 in WAL Mode", "PostgreSQL / MongoDB / Redis", "Synchronous C++ bindings in the Node process achieve < 0.5 ms latency without external network overhead, offering a zero-dependency, 100% rebuildable cache."),
        ("Document Storage", "IPFS Content Addressing", "AWS S3 / Direct Blockchain Storage", "Direct blockchain storage of 1 MB PDFs costs > $20,000 in gas. AWS S3 creates vendor lock-in. IPFS provides decentralized, tamper-evident content addressing via CIDs."),
        ("Farmer Review Integrity", "FeedbackRegistry tied to Marketplace", "Unrestricted Web2 Commenting", "Standard reviews are plagued by fake review buying and Sybil attacks. Requiring a completed on-chain escrow order ensures 100% authentic buyer reviews.")
    ]

    for row_idx, data in enumerate(comp_data, start=1):
        bg = "F9FAFB" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = comp_tbl.cell(row_idx, col_idx)
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    doc.add_paragraph() # Spacing

    # =========================================================================
    # SECTION 8: CONCLUSION
    # =========================================================================
    add_h1("8. Academic & Practical Conclusion")
    p = doc.add_paragraph(
        "The SeedSure architecture bridges agricultural supply chain vulnerabilities through an end-to-end cryptographic and economic shield. "
        "By binding laboratory quality records to immutable blockchain hashes, dynamically scoring seller reliability through verifiable ML oracles, "
        "and protecting farmer capital with non-custodial smart contract escrow, SeedSure transforms agricultural commerce from a system of blind trust "
        "into one of mathematical certainty. This prototype demonstrates that modern Web3 and machine learning technologies can be harmoniously "
        "integrated to protect vulnerable rural producers and enhance global food security."
    )
    p.paragraph_format.space_after = Pt(12)

    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "..", "docs", "SeedSure_Architecture_and_Working_Specification.docx")
    output_path = os.path.normpath(output_path)
    doc.save(output_path)
    print(f"Successfully generated Word document at: {output_path}")

if __name__ == "__main__":
    create_document()
