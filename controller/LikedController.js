const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const addLikes = (req, res) => {
  const {id} = req.params;

  let receiveJwt = req.headers["authorization"];
  console.log(receiveJwt);

  let decodedJwt = jwt.verify(receiveJwt, process.env.PRIVATE_KEY);
  console.log(decodedJwt);

  let sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
  let values = [decodedJwt.id, id];

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

const deleteLikes = (req, res) => {
  const {id} = req.params;

  let receiveJwt = req.headers["authorization"];
  console.log(receiveJwt);

  let decodedJwt = jwt.verify(receiveJwt, process.env.PRIVATE_KEY);
  console.log(decodedJwt);

  let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
  let values = [decodedJwt.id, id];

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

module.exports = {
  addLikes,
  deleteLikes
};