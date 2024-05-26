const express = require('express');
const router = express.Router();
const { addLikes, deleteLikes } = require('../controller/LikedController');

router.use(express.json());

// 좋아요 추가
router.post('/:id', addLikes);

// 좋아요 삭제
router.delete('/:id', deleteLikes);

module.exports = router