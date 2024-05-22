const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const viewAllBooks = (req, res) => {
  res.json('전체 도서 조회');
}

const viewIndividualBook = (req, res) => {
  res.json('개별 도서 조회');
}

const viewBooksByCategory = (req, res) => {
  res.json('카테고리 별 도서 조회');
}

module.exports = {
  viewAllBooks,
  viewIndividualBook,
  viewBooksByCategory
};