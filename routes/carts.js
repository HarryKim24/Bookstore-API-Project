const express = require('express');
const router = express.Router();
const { addCartItem, viewCartItems, removeCartItem } = require('../controller/CartController');

router.use(express.json());

// 장바구니 담기
router.post('/', addCartItem);

// 장바구니 조회
router.get('/', viewCartItems);

// 장바구니 도서 삭제
router.delete('/:id', removeCartItem);

// 장바구니 선택한 상품 목록 조회
// router.get('/', (req, res) => {
//   res.json('장바구니 선택한 상품 목록 조회');
// });

module.exports = router