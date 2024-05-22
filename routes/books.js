const express = require('express');
const router = express.Router();
const { viewAllBooks, viewIndividualBook, viewBooksByCategory } = require('../controller/BookController');

router.use(express.json());

// 전체 도서 조회
router.get('/', viewAllBooks);

// 개별 도서 조회
router.get('/:id', viewIndividualBook);

// 카테고리 별 도서 목록 조회
router.get('/', viewBooksByCategory);

module.exports = router