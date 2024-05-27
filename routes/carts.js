const express = require('express');
const router = express.Router();
const { addCartItem, viewCartItems, removeCartItem } = require('../controller/CartController');

router.use(express.json());

// 장바구니 담기
router.post('/', addCartItem);

// 장바구니 조회 / 선택된 장바구니 아이템 목록 조회
router.get('/', viewCartItems);

// 장바구니 도서 삭제
router.delete('/:id', removeCartItem);

module.exports = router