const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const viewAllBooks = (req, res) => {
  let sql = 'SELECT * FROM books';

  conn.query(sql,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    }
  );
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