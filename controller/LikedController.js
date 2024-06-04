const authorizationJwt = require('../auth');
const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const addLikes = (req, res) => {
  const book_id = req.params.id;

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
    let sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
    let values = [authorization.id, book_id];
  
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

const deleteLikes = (req, res) => {
  const book_id = req.params.id;

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
    let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
    let values = [authorization.id, book_id];
  
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

module.exports = {
  addLikes,
  deleteLikes
};