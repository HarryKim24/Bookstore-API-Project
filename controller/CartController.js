const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addCartItem = (req, res) => {
  const {user_id, book_id, count} = req.body;

  let sql = 'INSERT INTO cartItems (user_id, book_id, count) VALUES (?, ?, ?);';
  let values = [user_id, book_id, count];

  conn.query(sql, values,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    }
  );
}

const viewCartItems = (req, res) => {
  res.json('장바구니 목록 조회');
}

const removeCartItem = (req, res) => {
  res.json('장바구니 도서 삭제');
}

module.exports = {
  addCartItem,
  viewCartItems,
  removeCartItem
};