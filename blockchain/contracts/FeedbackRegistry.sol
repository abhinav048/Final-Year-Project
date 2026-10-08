// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMarketplace {
    struct Order {
        uint256 orderId;
        uint256 batchId;
        address buyer;
        address seller;
        uint256 quantity;
        uint256 totalPrice;
        uint8 status; // 2 = COMPLETED
        string trackingCID;
        string disputeEvidenceCID;
        uint256 createdAt;
        uint256 shippedAt;
        uint256 completedAt;
    }

    function getOrder(uint256 orderId) external view returns (Order memory);
}

/**
 * @title FeedbackRegistry
 * @dev Immutable on-chain farmer review registry.
 * Guarantees that only verified buyers of delivered batches can submit 1-5 star ratings,
 * preventing Sybil rating spam and fake review inflation.
 * Part of SeedSure Smart Contract Suite.
 */
contract FeedbackRegistry {
    struct FeedbackItem {
        uint256 orderId;
        address buyer;
        address seller;
        uint8 rating; // 1 to 5
        string commentCID;
        uint256 timestamp;
    }

    IMarketplace public marketplace;
    mapping(uint256 => FeedbackItem) private _feedbacks;
    mapping(uint256 => bool) private _hasFeedback;

    event FeedbackSubmitted(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint8 rating,
        string commentCID
    );

    constructor(address _marketplace) {
        marketplace = IMarketplace(_marketplace);
    }

    /**
     * @notice Submit verified rating and feedback for completed order
     */
    function submitFeedback(
        uint256 orderId,
        uint8 rating,
        string calldata commentCID
    ) external {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        require(!_hasFeedback[orderId], "Feedback already submitted for this order");

        IMarketplace.Order memory order = marketplace.getOrder(orderId);
        require(order.buyer == msg.sender, "Only the verified order buyer can review");
        require(order.status == 2, "Order must be COMPLETED (status 2) to submit review");

        _feedbacks[orderId] = FeedbackItem({
            orderId: orderId,
            buyer: msg.sender,
            seller: order.seller,
            rating: rating,
            commentCID: commentCID,
            timestamp: block.timestamp
        });
        _hasFeedback[orderId] = true;

        emit FeedbackSubmitted(orderId, msg.sender, order.seller, rating, commentCID);
    }

    /**
     * @notice Fetch feedback by order ID
     */
    function getFeedback(uint256 orderId) external view returns (FeedbackItem memory) {
        require(_hasFeedback[orderId], "No feedback recorded for order");
        return _feedbacks[orderId];
    }

    /**
     * @notice Check if feedback has already been submitted
     */
    function hasFeedback(uint256 orderId) external view returns (bool) {
        return _hasFeedback[orderId];
    }
}
