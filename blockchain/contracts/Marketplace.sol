// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISellerRegistry {
    function isSellerActive(address seller) external view returns (bool);
    function recordOrderPlaced(address seller) external;
    function recordOrderDelivered(address seller, bool onTime) external;
    function recordOrderDisputed(address seller) external;
    function recordDisputeResolved(address seller, bool sellerLost) external;
}

interface ISeedRegistry {
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
        uint8 status;
        bytes32 certificateHash;
        string certificateCID;
    }

    function getBatch(uint256 batchId) external view returns (Batch memory);
    function deductQuantity(uint256 batchId, uint256 quantity) external;
}

interface ITrustScoreRegistry {
    function meetsTrustThreshold(address seller, uint8 minScore) external view returns (bool);
}

/**
 * @title Marketplace
 * @dev Non-custodial smart contract escrow and decentralized seed trading platform.
 * Implements automated farmer protection gating via dynamic ML trust thresholds.
 * Part of SeedSure Smart Contract Suite.
 */
contract Marketplace is AccessControl, ReentrancyGuard {
    bytes32 public constant DISPUTE_RESOLVER_ROLE = keccak256("DISPUTE_RESOLVER_ROLE");

    enum OrderStatus {
        ESCROWED,
        SHIPPED,
        COMPLETED,
        DISPUTED,
        REFUNDED
    }

    struct Order {
        uint256 orderId;
        uint256 batchId;
        address buyer;
        address seller;
        uint256 quantity;
        uint256 totalPrice; // in wei
        OrderStatus status;
        string trackingCID;
        string disputeEvidenceCID;
        uint256 createdAt;
        uint256 shippedAt;
        uint256 completedAt;
    }

    ISellerRegistry public sellerRegistry;
    ISeedRegistry public seedRegistry;
    ITrustScoreRegistry public trustScoreRegistry;

    uint8 public minTrustScore = 40; // Default safety threshold (0-100)
    uint256 private _orderIdCounter;
    mapping(uint256 => Order) private _orders;

    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed batchId,
        address indexed buyer,
        address seller,
        uint256 quantity,
        uint256 totalPrice
    );
    event PaymentEscrowed(uint256 indexed orderId, uint256 amount);
    event OrderShipped(uint256 indexed orderId, string trackingCID);
    event DeliveryConfirmed(uint256 indexed orderId);
    event PaymentReleased(uint256 indexed orderId, address indexed seller, uint256 amount);
    event OrderDisputed(uint256 indexed orderId, address indexed buyer, string evidenceCID);
    event DisputeResolved(uint256 indexed orderId, uint8 outcome);
    event MinTrustScoreUpdated(uint8 oldScore, uint8 newScore);

    constructor(
        address defaultAdmin,
        address disputeResolver,
        address _sellerRegistry,
        address _seedRegistry,
        address _trustScoreRegistry
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(DISPUTE_RESOLVER_ROLE, disputeResolver);

        sellerRegistry = ISellerRegistry(_sellerRegistry);
        seedRegistry = ISeedRegistry(_seedRegistry);
        trustScoreRegistry = ITrustScoreRegistry(_trustScoreRegistry);
    }

    /**
     * @notice Set minimum seller trust score required for purchases (Farmer Safety Gate)
     */
    function setMinTrustScore(uint8 newMinScore) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newMinScore <= 100, "Invalid score");
        uint8 old = minTrustScore;
        minTrustScore = newMinScore;
        emit MinTrustScoreUpdated(old, newMinScore);
    }

    /**
     * @notice Create an escrow order and lock ETH funds in smart contract
     */
    function createOrder(uint256 batchId, uint256 quantity)
        external
        payable
        nonReentrant
        returns (uint256)
    {
        require(quantity > 0, "Quantity must be > 0");

        ISeedRegistry.Batch memory batch = seedRegistry.getBatch(batchId);
        require(batch.availableQuantity >= quantity, "Insufficient inventory in batch");
        require(sellerRegistry.isSellerActive(batch.seller), "Seller is not active or is suspended");

        // Trust score gating: protect farmer if seller is high risk (< threshold)
        require(
            trustScoreRegistry.meetsTrustThreshold(batch.seller, minTrustScore),
            "Seller trust score below safety threshold. Farmer escrow gate blocked purchase."
        );

        uint256 expectedPrice = batch.pricePerKg * quantity;
        require(msg.value >= expectedPrice, "Insufficient ETH sent for purchase");

        // Deduct inventory in SeedRegistry
        seedRegistry.deductQuantity(batchId, quantity);

        _orderIdCounter += 1;
        uint256 newOrderId = _orderIdCounter;

        _orders[newOrderId] = Order({
            orderId: newOrderId,
            batchId: batchId,
            buyer: msg.sender,
            seller: batch.seller,
            quantity: quantity,
            totalPrice: expectedPrice,
            status: OrderStatus.ESCROWED,
            trackingCID: "",
            disputeEvidenceCID: "",
            createdAt: block.timestamp,
            shippedAt: 0,
            completedAt: 0
        });

        // Update seller record
        sellerRegistry.recordOrderPlaced(batch.seller);

        emit OrderCreated(newOrderId, batchId, msg.sender, batch.seller, quantity, expectedPrice);
        emit PaymentEscrowed(newOrderId, expectedPrice);

        // Refund any excess ETH sent
        if (msg.value > expectedPrice) {
            (bool refundOk, ) = payable(msg.sender).call{value: msg.value - expectedPrice}("");
            require(refundOk, "Refund of excess ETH failed");
        }

        return newOrderId;
    }

    /**
     * @notice Breeder ships order and records carrier tracking hash
     */
    function shipOrder(uint256 orderId, string calldata trackingCID) external {
        require(orderId > 0 && orderId <= _orderIdCounter, "Invalid order ID");
        Order storage order = _orders[orderId];
        require(msg.sender == order.seller, "Only seller can mark shipped");
        require(order.status == OrderStatus.ESCROWED, "Order not in ESCROWED status");

        order.status = OrderStatus.SHIPPED;
        order.trackingCID = trackingCID;
        order.shippedAt = block.timestamp;

        emit OrderShipped(orderId, trackingCID);
    }

    /**
     * @notice Farmer confirms delivery and viability: unlocks escrow payment to seller
     */
    function confirmDelivery(uint256 orderId) external nonReentrant {
        require(orderId > 0 && orderId <= _orderIdCounter, "Invalid order ID");
        Order storage order = _orders[orderId];
        require(msg.sender == order.buyer, "Only buyer can confirm delivery");
        require(order.status == OrderStatus.SHIPPED, "Order not in SHIPPED status");

        order.status = OrderStatus.COMPLETED;
        order.completedAt = block.timestamp;

        sellerRegistry.recordOrderDelivered(order.seller, true);

        uint256 amount = order.totalPrice;
        (bool sent, ) = payable(order.seller).call{value: amount}("");
        require(sent, "Failed to release escrow payment to seller");

        emit DeliveryConfirmed(orderId);
        emit PaymentReleased(orderId, order.seller, amount);
    }

    /**
     * @notice Farmer raises dispute (poor germination, damaged bags, fake batch)
     */
    function disputeOrder(uint256 orderId, string calldata evidenceCID) external {
        require(orderId > 0 && orderId <= _orderIdCounter, "Invalid order ID");
        Order storage order = _orders[orderId];
        require(msg.sender == order.buyer, "Only buyer can dispute order");
        require(
            order.status == OrderStatus.ESCROWED || order.status == OrderStatus.SHIPPED,
            "Cannot dispute finished order"
        );

        order.status = OrderStatus.DISPUTED;
        order.disputeEvidenceCID = evidenceCID;

        sellerRegistry.recordOrderDisputed(order.seller);

        emit OrderDisputed(orderId, msg.sender, evidenceCID);
    }

    /**
     * @notice Certified arbiter resolves escrow dispute
     * @param outcome 0 = REFUND (buyer), 1 = RELEASE_TO_SELLER, 2 = SPLIT (50/50)
     */
    function resolveDispute(uint256 orderId, uint8 outcome)
        external
        onlyRole(DISPUTE_RESOLVER_ROLE)
        nonReentrant
    {
        require(orderId > 0 && orderId <= _orderIdCounter, "Invalid order ID");
        Order storage order = _orders[orderId];
        require(order.status == OrderStatus.DISPUTED, "Order not in DISPUTED status");
        require(outcome <= 2, "Invalid outcome code");

        uint256 amount = order.totalPrice;

        if (outcome == 0) {
            // Full Refund to Buyer
            order.status = OrderStatus.REFUNDED;
            sellerRegistry.recordDisputeResolved(order.seller, true);
            (bool refundOk, ) = payable(order.buyer).call{value: amount}("");
            require(refundOk, "Dispute refund failed");
        } else if (outcome == 1) {
            // Full Release to Seller
            order.status = OrderStatus.COMPLETED;
            sellerRegistry.recordDisputeResolved(order.seller, false);
            (bool payOk, ) = payable(order.seller).call{value: amount}("");
            require(payOk, "Dispute payout failed");
            emit PaymentReleased(orderId, order.seller, amount);
        } else {
            // Split 50/50
            order.status = OrderStatus.COMPLETED;
            sellerRegistry.recordDisputeResolved(order.seller, false);
            uint256 half = amount / 2;
            (bool refundOk, ) = payable(order.buyer).call{value: half}("");
            (bool payOk, ) = payable(order.seller).call{value: amount - half}("");
            require(refundOk && payOk, "Split transfer failed");
            emit PaymentReleased(orderId, order.seller, amount - half);
        }

        order.completedAt = block.timestamp;
        emit DisputeResolved(orderId, outcome);
    }

    /**
     * @notice Fetch single order
     */
    function getOrder(uint256 orderId) external view returns (Order memory) {
        require(orderId > 0 && orderId <= _orderIdCounter, "Invalid order ID");
        return _orders[orderId];
    }

    /**
     * @notice Total orders count
     */
    function totalOrders() external view returns (uint256) {
        return _orderIdCounter;
    }
}
