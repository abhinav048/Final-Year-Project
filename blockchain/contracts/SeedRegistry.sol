// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SeedRegistry
 * @dev Manages seed lot registration, lab quality parameters, SHA-256 certificate hashes,
 * and CA certification/revocation lifecycle.
 * Part of SeedSure Smart Contract Suite.
 */
contract SeedRegistry is AccessControl {
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    enum BatchStatus {
        Pending,
        Certified,
        Revoked
    }

    struct Batch {
        uint256 batchId;
        address seller;
        string name;
        string cropType;
        string variety;
        string batchNumber;
        uint16 germinationRate;
        uint16 purity;
        uint16 vigor;
        uint16 moisture;
        uint256 pricePerKg;
        uint256 availableQuantity;
        uint8 status; // 0 = Pending, 1 = Certified, 2 = Revoked
        bytes32 certificateHash; // SHA-256 hash of official lab certificate
        string certificateCID;
    }

    // Extended details storage for research auditability
    struct BatchMetadata {
        string manufacturer;
        string diseaseResistance;
        uint256 expiryDate;
        string metadataCID;
        uint256 registeredAt;
        address certifiedBy;
        uint256 certifiedAt;
        string revocationReason;
    }

    // AI Visual Seed Quality Assessment Record
    struct AIQualityRecord {
        uint8 visualQualityScore; // 0 to 100
        string qualityCategory; // "Excellent" | "Good" | "Moderate" | "Poor" | "Very Poor"
        string reportCID; // IPFS CID of detailed batch assessment
        bytes32 reportHash; // SHA-256 hash of full batch report
        string modelVersion; // e.g. "SeedSure-ViT-B16-v1.0"
        uint256 assessedAt;
        bool isAssessed;
    }

    uint256 private _batchIdCounter;
    mapping(uint256 => Batch) private _batches;
    mapping(uint256 => BatchMetadata) private _batchMetadata;
    mapping(uint256 => AIQualityRecord) private _qualityAssessments;
    mapping(bytes32 => bool) private _registeredHashes;

    event BatchRegistered(
        uint256 indexed batchId,
        address indexed seller,
        string batchNumber,
        bytes32 certificateHash
    );
    event BatchCertified(uint256 indexed batchId, address indexed certifier);
    event BatchRevoked(uint256 indexed batchId, address indexed certifier, string reason);
    event BatchQuantityUpdated(uint256 indexed batchId, uint256 remainingQuantity);
    event BatchQualityAssessed(
        uint256 indexed batchId,
        uint8 visualQualityScore,
        string qualityCategory,
        string reportCID,
        bytes32 reportHash,
        string modelVersion,
        uint256 assessedAt
    );

    constructor(address defaultAdmin, address initialCertifier) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(CERTIFIER_ROLE, initialCertifier);
        _grantRole(ORACLE_ROLE, defaultAdmin);
        _grantRole(ORACLE_ROLE, initialCertifier);
    }

    /**
     * @notice Register a newly harvested and lab-tested seed batch
     */
    function registerBatch(
        string calldata name,
        string calldata cropType,
        string calldata variety,
        string calldata batchNumber,
        string calldata manufacturer,
        uint16 germinationRate,
        uint16 purity,
        uint16 vigor,
        uint16 moisture,
        string calldata diseaseResistance,
        uint256 expiryDate,
        uint256 pricePerKg,
        uint256 availableQuantity,
        string calldata metadataCID,
        string calldata certificateCID,
        bytes32 certificateHash
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(batchNumber).length > 0, "Batch number required");
        require(certificateHash != bytes32(0), "Certificate hash required");
        require(pricePerKg > 0, "Price must be > 0");
        require(availableQuantity > 0, "Quantity must be > 0");
        require(!_registeredHashes[certificateHash], "Certificate hash already registered");

        _batchIdCounter += 1;
        uint256 newBatchId = _batchIdCounter;

        _batches[newBatchId] = Batch({
            batchId: newBatchId,
            seller: msg.sender,
            name: name,
            cropType: cropType,
            variety: variety,
            batchNumber: batchNumber,
            germinationRate: germinationRate,
            purity: purity,
            vigor: vigor,
            moisture: moisture,
            pricePerKg: pricePerKg,
            availableQuantity: availableQuantity,
            status: uint8(BatchStatus.Pending),
            certificateHash: certificateHash,
            certificateCID: certificateCID
        });

        _batchMetadata[newBatchId] = BatchMetadata({
            manufacturer: manufacturer,
            diseaseResistance: diseaseResistance,
            expiryDate: expiryDate,
            metadataCID: metadataCID,
            registeredAt: block.timestamp,
            certifiedBy: address(0),
            certifiedAt: 0,
            revocationReason: ""
        });

        _registeredHashes[certificateHash] = true;

        emit BatchRegistered(newBatchId, msg.sender, batchNumber, certificateHash);
        return newBatchId;
    }

    /**
     * @notice Official CA agency certifies seed lot after independent laboratory validation
     */
    function certifyBatch(uint256 batchId) external onlyRole(CERTIFIER_ROLE) {
        require(batchId > 0 && batchId <= _batchIdCounter, "Invalid batch ID");
        require(_batches[batchId].status == uint8(BatchStatus.Pending), "Batch not in pending state");

        _batches[batchId].status = uint8(BatchStatus.Certified);
        _batchMetadata[batchId].certifiedBy = msg.sender;
        _batchMetadata[batchId].certifiedAt = block.timestamp;

        emit BatchCertified(batchId, msg.sender);
    }

    /**
     * @notice Revoke certification if subsequent testing discovers contamination or adulteration
     */
    function revokeBatch(uint256 batchId, string calldata reason) external onlyRole(CERTIFIER_ROLE) {
        require(batchId > 0 && batchId <= _batchIdCounter, "Invalid batch ID");
        require(_batches[batchId].status != uint8(BatchStatus.Revoked), "Batch already revoked");

        _batches[batchId].status = uint8(BatchStatus.Revoked);
        _batchMetadata[batchId].certifiedBy = msg.sender;
        _batchMetadata[batchId].revocationReason = reason;

        emit BatchRevoked(batchId, msg.sender, reason);
    }

    /**
     * @notice Marketplace escrow inventory deduction upon purchase
     */
    function deductQuantity(uint256 batchId, uint256 quantity) external onlyRole(MARKETPLACE_ROLE) {
        require(batchId > 0 && batchId <= _batchIdCounter, "Invalid batch ID");
        require(_batches[batchId].availableQuantity >= quantity, "Insufficient batch inventory");

        _batches[batchId].availableQuantity -= quantity;
        emit BatchQuantityUpdated(batchId, _batches[batchId].availableQuantity);
    }

    /**
     * @notice Real-time tamper checking function: compares client-computed SHA-256 to on-chain record
     */
    function verifyBatch(uint256 batchId, bytes32 testHash) external view returns (bool isValid, bool isCertified) {
        if (batchId == 0 || batchId > _batchIdCounter) {
            return (false, false);
        }
        Batch memory b = _batches[batchId];
        isValid = (b.certificateHash == testHash);
        isCertified = (b.status == uint8(BatchStatus.Certified));
    }

    /**
     * @notice Fetch batch info matching the standard ABI tuple
     */
    function getBatch(uint256 batchId) external view returns (Batch memory) {
        require(batchId > 0 && batchId <= _batchIdCounter, "Invalid batch ID");
        return _batches[batchId];
    }

    /**
     * @notice Fetch extended metadata (manufacturer, disease resistance, dates)
     */
    function getBatchMetadata(uint256 batchId) external view returns (BatchMetadata memory) {
        require(batchId > 0 && batchId <= _batchIdCounter, "Invalid batch ID");
        return _batchMetadata[batchId];
    }

    /**
     * @notice Total registered seed batches count
     */
    function totalBatches() external view returns (uint256) {
        return _batchIdCounter;
    }

    /**
     * @notice Push verified AI visual seed quality score and IPFS report hash
     */
    function recordBatchQualityAssessment(
        uint256 batchId,
        uint8 visualQualityScore,
        string calldata qualityCategory,
        string calldata reportCID,
        bytes32 reportHash,
        string calldata modelVersion
    ) external onlyRole(ORACLE_ROLE) {
        require(batchId > 0 && batchId <= _batchIdCounter, "Invalid batch ID");
        require(visualQualityScore <= 100, "Score must be <= 100");
        require(reportHash != bytes32(0), "Report hash required");

        _qualityAssessments[batchId] = AIQualityRecord({
            visualQualityScore: visualQualityScore,
            qualityCategory: qualityCategory,
            reportCID: reportCID,
            reportHash: reportHash,
            modelVersion: modelVersion,
            assessedAt: block.timestamp,
            isAssessed: true
        });

        emit BatchQualityAssessed(
            batchId,
            visualQualityScore,
            qualityCategory,
            reportCID,
            reportHash,
            modelVersion,
            block.timestamp
        );
    }

    /**
     * @notice Retrieve on-chain AI visual quality assessment for a batch
     */
    function getBatchQualityAssessment(uint256 batchId)
        external
        view
        returns (
            uint8 visualQualityScore,
            string memory qualityCategory,
            string memory reportCID,
            bytes32 reportHash,
            string memory modelVersion,
            uint256 assessedAt,
            bool isAssessed
        )
    {
        require(batchId > 0 && batchId <= _batchIdCounter, "Invalid batch ID");
        AIQualityRecord memory r = _qualityAssessments[batchId];
        return (
            r.visualQualityScore,
            r.qualityCategory,
            r.reportCID,
            r.reportHash,
            r.modelVersion,
            r.assessedAt,
            r.isAssessed
        );
    }
}
