const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const addCartItem = (req, res) => {
  const {book_id, count} = req.body;

  let authorization = authorizationJwt(req);

  let sql = 'INSERT INTO cartItems (user_id, book_id, count) VALUES (?, ?, ?);';
  let values = [authorization.id, book_id, count];

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
  const {selected} = req.body;

  let authorization = authorizationJwt(req);

  let sql = `SELECT cartItems.id, book_id, title, summary, count, price 
            FROM cartItems LEFT JOIN books 
            ON cartItems.book_id = books.id
            WHERE user_id=? AND cartItems.id IN (?)`;
  let values = [authorization.id, selected];

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
  const cartItem_id = req.params.id;

  let sql = 'DELETE FROM cartItems WHERE id = ?';

  conn.query(sql, cartItem_id,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    }
  );
}

function authorizationJwt (req) {
  let receiveJwt = req.headers["authorization"];
  console.log(receiveJwt);

  let decodedJwt = jwt.verify(receiveJwt, process.env.PRIVATE_KEY);
  console.log(decodedJwt);

  return decodedJwt;
}

module.exports = {
  addCartItem,
  viewCartItems,
  removeCartItem
};