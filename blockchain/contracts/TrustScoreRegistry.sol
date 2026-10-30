// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title TrustScoreRegistry
 * @dev Stores dynamic ML-computed seller credibility ratings, risk categories, and
 * cryptographic feature hashes for paper auditability.
 * Part of SeedSure Smart Contract Suite.
 */
contract TrustScoreRegistry is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct ScoreRecord {
        uint8 score; // 0 to 100
        string riskCategory; // "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk"
        uint256 updatedAt;
        string modelVersion; // e.g. "SeedSure-ML-v1.4"
        bytes32 featuresHash; // SHA-256 hash of canonical multi-factor vector
    }

    struct TrustUpdateAudit {
        uint8 previousScore;
        uint8 newScore;
        string riskCategory;
        string modelVersion;
        bytes32 featuresHash;
        string reason;
        uint256 timestamp;
    }

    mapping(address => ScoreRecord) private _scores;
    mapping(address => bool) private _hasScore;
    mapping(address => TrustUpdateAudit[]) private _sellerHistory;

    event TrustScoreUpdated(
        address indexed seller,
        uint8 score,
        string riskCategory,
        string modelVersion,
        bytes32 featuresHash
    );

    event TrustScoreUpdatedWithReason(
        address indexed seller,
        uint8 previousScore,
        uint8 newScore,
        string riskCategory,
        string modelVersion,
        bytes32 featuresHash,
        string reason,
        uint256 timestamp
    );

    constructor(address defaultAdmin, address initialOracle) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(ORACLE_ROLE, initialOracle);
    }

    /**
     * @notice Push new ML multi-factor trust rating to the blockchain
     */
    function updateTrustScore(
        address seller,
        uint8 score,
        string calldata riskCategory,
        string calldata modelVersion,
        bytes32 featuresHash
    ) external onlyRole(ORACLE_ROLE) {
        _updateTrustInternal(seller, score, riskCategory, modelVersion, featuresHash, "Regular Oracle Update");
    }

    /**
     * @notice Push new ML multi-factor trust rating with explicit auditable reason
     */
    function updateTrustScoreWithReason(
        address seller,
        uint8 score,
        string calldata riskCategory,
        string calldata modelVersion,
        bytes32 featuresHash,
        string calldata reason
    ) external onlyRole(ORACLE_ROLE) {
        _updateTrustInternal(seller, score, riskCategory, modelVersion, featuresHash, reason);
    }

    function _updateTrustInternal(
        address seller,
        uint8 score,
        string calldata riskCategory,
        string calldata modelVersion,
        bytes32 featuresHash,
        string memory reason
    ) internal {
        require(seller != address(0), "Invalid seller address");
        require(score <= 100, "Score must be <= 100");

        uint8 prevScore = _hasScore[seller] ? _scores[seller].score : 50;

        _scores[seller] = ScoreRecord({
            score: score,
            riskCategory: riskCategory,
            updatedAt: block.timestamp,
            modelVersion: modelVersion,
            featuresHash: featuresHash
        });
        _hasScore[seller] = true;

        _sellerHistory[seller].push(TrustUpdateAudit({
            previousScore: prevScore,
            newScore: score,
            riskCategory: riskCategory,
            modelVersion: modelVersion,
            featuresHash: featuresHash,
            reason: reason,
            timestamp: block.timestamp
        }));

        emit TrustScoreUpdated(seller, score, riskCategory, modelVersion, featuresHash);
        emit TrustScoreUpdatedWithReason(
            seller,
            prevScore,
            score,
            riskCategory,
            modelVersion,
            featuresHash,
            reason,
            block.timestamp
        );
    }

    /**
     * @notice Fetch current trust score and audit vector hash
     */
    function getTrustScore(address seller)
        external
        view
        returns (
            uint8 score,
            string memory riskCategory,
            uint256 updatedAt,
            string memory modelVersion,
            bytes32 featuresHash
        )
    {
        if (!_hasScore[seller]) {
            return (50, "Moderate", 0, "Default", bytes32(0));
        }
        ScoreRecord memory record = _scores[seller];
        return (
            record.score,
            record.riskCategory,
            record.updatedAt,
            record.modelVersion,
            record.featuresHash
        );
    }

    /**
     * @notice Check whether a seller meets the minimum trust requirement
     */
    function meetsTrustThreshold(address seller, uint8 minScore) external view returns (bool) {
        if (!_hasScore[seller]) {
            return 50 >= minScore;
        }
        return _scores[seller].score >= minScore;
    }

    /**
     * @notice Get count of on-chain auditable trust score updates
     */
    function getTrustScoreHistoryCount(address seller) external view returns (uint256) {
        return _sellerHistory[seller].length;
    }

    /**
     * @notice Get an on-chain auditable trust score update record by index
     */
    function getTrustScoreHistoryItem(address seller, uint256 index)
        external
        view
        returns (
            uint8 previousScore,
            uint8 newScore,
            string memory riskCategory,
            string memory modelVersion,
            bytes32 featuresHash,
            string memory reason,
            uint256 timestamp
        )
    {
        require(index < _sellerHistory[seller].length, "Index out of bounds");
        TrustUpdateAudit memory h = _sellerHistory[seller][index];
        return (
            h.previousScore,
            h.newScore,
            h.riskCategory,
            h.modelVersion,
            h.featuresHash,
            h.reason,
            h.timestamp
        );
    }
}
