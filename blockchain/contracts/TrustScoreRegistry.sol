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

    mapping(address => ScoreRecord) private _scores;
    mapping(address => bool) private _hasScore;

    event TrustScoreUpdated(
        address indexed seller,
        uint8 score,
        string riskCategory,
        string modelVersion,
        bytes32 featuresHash
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
        require(seller != address(0), "Invalid seller address");
        require(score <= 100, "Score must be <= 100");

        _scores[seller] = ScoreRecord({
            score: score,
            riskCategory: riskCategory,
            updatedAt: block.timestamp,
            modelVersion: modelVersion,
            featuresHash: featuresHash
        });
        _hasScore[seller] = true;

        emit TrustScoreUpdated(seller, score, riskCategory, modelVersion, featuresHash);
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
}
