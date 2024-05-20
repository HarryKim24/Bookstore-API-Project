const express = require('express');
const router = express.Router();

router.use(express.json());

// 결제
router.post('/', (req, res) => {
  res.json('결제');
});

// 결제 내역 조회
router.get('/', (req, res) => {
  res.json('결제 내역 조회');
});

// 결제 상세 상품 조회
router.get('/:id', (req, res) => {
  res.json('결제 상세 상품 조회');
});

module.exports = router