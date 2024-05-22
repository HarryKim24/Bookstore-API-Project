const express = require('express');
const router = express.Router();
const { viewAllBooks, viewIndividualBook } = require('../controller/BookController');

router.use(express.json());

// (카테고리 별)전체 도서 조회
router.get('/', viewAllBooks);

// 개별 도서 조회
router.get('/:id', viewIndividualBook);

module.exports = router