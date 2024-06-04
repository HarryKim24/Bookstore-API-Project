const authorizationJwt = require('../auth');
const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addCartItem = (req, res) => {
  const {book_id, count} = req.body;

  let authorization = authorizationJwt(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message" : "로그인 세션이 만료되었습니다. 다시 로그인 하시오."
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message" : "잘못된 토큰입니다."
    });
  } else {
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
}

const viewCartItems = (req, res) => {
  const {selected} = req.body;

  let authorization = authorizationJwt(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message" : "로그인 세션이 만료되었습니다. 다시 로그인 하시오."
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message" : "잘못된 토큰입니다."
    });
  } else {
    let sql = `SELECT cartItems.id, book_id, title, summary, count, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id=?`;
    let values = [authorization.id];

    if (selected) {
      sql += ` AND cartItems.id IN (?)`;
      values.push(selected);
    }
    
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
}

const removeCartItem = (req, res) => {

  let authorization = authorizationJwt(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message" : "로그인 세션이 만료되었습니다. 다시 로그인 하시오."
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message" : "잘못된 토큰입니다."
    });
  } else {
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
}

module.exports = {
  addCartItem,
  viewCartItems,
  removeCartItem
};