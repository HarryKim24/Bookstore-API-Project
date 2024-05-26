const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addLikes = (req, res) => {
  const {id} = req.params;
  const {user_id} = req.body;

  let sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
  let values = [user_id, id];

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
  res.json('좋아요 삭제');
}

module.exports = {
  addLikes,
  deleteLikes
};