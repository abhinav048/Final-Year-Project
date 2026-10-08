// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SellerRegistry
 * @dev Manages seed breeders/sellers, verification status, operational metrics, and governance.
 * Part of SeedSure Smart Contract Suite.
 */
contract SellerRegistry is AccessControl {
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");

    struct Seller {
        address sellerAddress;
        string metadataCID;
        bool isVerified;
        bool isSuspended;
        uint256 totalOrders;
        uint256 successfulOrders;
        uint256 failedOrders;
        uint256 deliveredOrders;
        uint256 delayedOrders;
        uint256 disputedOrders;
        uint256 disputesLost;
        uint256 registeredAt;
    }

    mapping(address => Seller) private _sellers;
    mapping(address => bool) private _isRegistered;
    address[] private _allSellers;

    event SellerRegistered(address indexed seller, string metadataCID);
    event SellerVerified(address indexed seller, address indexed certifier);
    event SellerSuspended(address indexed seller);
    event SellerUnsuspended(address indexed seller);
    event SellerMetricsUpdated(address indexed seller, uint256 totalOrders, uint256 successfulOrders);

    constructor(address defaultAdmin, address initialCertifier) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(CERTIFIER_ROLE, initialCertifier);
    }

    /**
     * @notice Register sender as a seed breeder / seller
     * @param metadataCID IPFS CID containing corporate and accreditation credentials
     */
    function registerSeller(string calldata metadataCID) external {
        require(!_isRegistered[msg.sender], "Seller already registered");

        Seller memory newSeller = Seller({
            sellerAddress: msg.sender,
            metadataCID: metadataCID,
            isVerified: false,
            isSuspended: false,
            totalOrders: 0,
            successfulOrders: 0,
            failedOrders: 0,
            deliveredOrders: 0,
            delayedOrders: 0,
            disputedOrders: 0,
            disputesLost: 0,
            registeredAt: block.timestamp
        });

        _sellers[msg.sender] = newSeller;
        _isRegistered[msg.sender] = true;
        _allSellers.push(msg.sender);

        emit SellerRegistered(msg.sender, metadataCID);
    }

    /**
     * @notice Official CA agency verifies seller identity and laboratory credentials
     */
    function verifySeller(address seller) external onlyRole(CERTIFIER_ROLE) {
        require(_isRegistered[seller], "Seller not registered");
        require(!_sellers[seller].isVerified, "Seller already verified");

        _sellers[seller].isVerified = true;
        emit SellerVerified(seller, msg.sender);
    }

    /**
     * @notice Platform admin suspends malicious or compromised seller
     */
    function suspendSeller(address seller) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_isRegistered[seller], "Seller not registered");
        require(!_sellers[seller].isSuspended, "Seller already suspended");

        _sellers[seller].isSuspended = true;
        emit SellerSuspended(seller);
    }

    /**
     * @notice Platform admin removes suspension after compliance audit
     */
    function unsuspendSeller(address seller) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_isRegistered[seller], "Seller not registered");
        require(_sellers[seller].isSuspended, "Seller not suspended");

        _sellers[seller].isSuspended = false;
        emit SellerUnsuspended(seller);
    }

    /**
     * @notice Update performance metrics when an order is created (called by Marketplace contract)
     */
    function recordOrderPlaced(address seller) external onlyRole(MARKETPLACE_ROLE) {
        require(_isRegistered[seller], "Seller not registered");
        _sellers[seller].totalOrders += 1;
    }

    /**
     * @notice Update performance metrics upon delivery (called by Marketplace contract)
     */
    function recordOrderDelivered(address seller, bool onTime) external onlyRole(MARKETPLACE_ROLE) {
        require(_isRegistered[seller], "Seller not registered");
        _sellers[seller].deliveredOrders += 1;
        _sellers[seller].successfulOrders += 1;
        if (!onTime) {
            _sellers[seller].delayedOrders += 1;
        }
        emit SellerMetricsUpdated(seller, _sellers[seller].totalOrders, _sellers[seller].successfulOrders);
    }

    /**
     * @notice Record when an order is disputed by farmer
     */
    function recordOrderDisputed(address seller) external onlyRole(MARKETPLACE_ROLE) {
        require(_isRegistered[seller], "Seller not registered");
        _sellers[seller].disputedOrders += 1;
    }

    /**
     * @notice Record dispute resolution outcome
     */
    function recordDisputeResolved(address seller, bool sellerLost) external onlyRole(MARKETPLACE_ROLE) {
        require(_isRegistered[seller], "Seller not registered");
        if (sellerLost) {
            _sellers[seller].disputesLost += 1;
            _sellers[seller].failedOrders += 1;
        } else {
            _sellers[seller].successfulOrders += 1;
        }
    }

    /**
     * @notice Fetch complete seller profile
     */
    function getSeller(address seller) external view returns (Seller memory) {
        require(_isRegistered[seller], "Seller not registered");
        return _sellers[seller];
    }

    /**
     * @notice Check if seller is registered and in good standing
     */
    function isSellerActive(address seller) external view returns (bool) {
        return _isRegistered[seller] && !_sellers[seller].isSuspended;
    }

    /**
     * @notice Total registered sellers count
     */
    function getSellerCount() external view returns (uint256) {
        return _allSellers.length;
    }
}
