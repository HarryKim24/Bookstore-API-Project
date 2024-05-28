const express = require('express');
const router = express.Router();
const { order, viewOrders, viewOrderDetail } = require('../controller/OrderController');

router.use(express.json());

// 주문
router.post('/', order);

// 주문 목록 조회
router.get('/', viewOrders);

// 주문 상세 조회
router.get('/:id', viewOrderDetail);

module.exports = router