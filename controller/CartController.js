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
  const {user_id, selected} = req.body;

  let sql = `SELECT cartItems.id, book_id, title, summary, count, price 
            FROM cartItems LEFT JOIN books 
            ON cartItems.book_id = books.id
            WHERE user_id=? AND cartItems.id IN (?)`;
  let values = [user_id, selected];

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

const removeCartItem = (req, res) => {
  const {id} = req.params;

  let sql = 'DELETE FROM cartItems WHERE id = ?';

  conn.query(sql, id,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    }
  );
}

module.exports = {
  addCartItem,
  viewCartItems,
  removeCartItem
};