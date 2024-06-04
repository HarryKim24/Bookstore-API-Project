const authorizationJwt = require('../auth');
const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const viewAllBooks = (req, res) => {
  let resAllBooks = {};
  let {category_id, new_books, limit, current_page} = req.query;
  let offset = limit * (current_page - 1);

  let sql = `SELECT sql_calc_found_rows *, 
            (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books`;
  let values = [];

  if (category_id && new_books) {
    sql += ` WHERE category_id=?
            AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    values = [category_id];
  } else if (category_id) {
    sql += ' WHERE category_id=?';
    values = [category_id];
  } else if (new_books) {
    sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }

  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), offset);

  conn.query(sql, values,
    (err, results) => {
      if (err) {
        console.log(err);
        // return res.status(StatusCodes.BAD_REQUEST).end();
      }
      console.log(results);

      if (results.length)
        resAllBooks.books = results;
      else 
        return res.status(StatusCodes.NOT_FOUND).end();
    }
  );

  sql = 'SELECT found_rows();';

  conn.query(sql, values,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      let pagenation = {};
      pagenation.current_page = parseInt(current_page);
      pagenation.total_count = results[0]["found_rows()"];

      resAllBooks.pagenation = pagenation;

      return res.status(StatusCodes.OK).json(resAllBooks);
    }
  );
}

const viewIndividualBook = (req, res) => {

  let authorization = authorizationJwt(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message" : "로그인 세션이 만료되었습니다. 다시 로그인 하시오."
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message" : "잘못된 토큰입니다."
    });
  } else if (authorization instanceof ReferenceError) {
    let book_id = req.params.id;

    let sql = `SELECT *,
                (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes 
                FROM books
                LEFT JOIN category
                ON books.category_id=category.category_id
                WHERE books.id=?;`;
    let values = [book_id];
    
    conn.query(sql, values,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(StatusCodes.BAD_REQUEST).end();
        }
          
        if (results[0]) {
          return res.status(StatusCodes.OK).json(results[0]);
        } else {
          return res.status(StatusCodes.NOT_FOUND).end();
        }
      }
    ); 
  } else {
    let book_id = req.params.id;
  
    let sql = `SELECT *,
              (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
              (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
              FROM books
              LEFT JOIN category
              ON books.category_id=category.category_id
              WHERE books.id=?;`;
    let values = [authorization.id, book_id, book_id];
  
    conn.query(sql, values,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(StatusCodes.BAD_REQUEST).end();
        }
  
        if (results[0]) {
          return res.status(StatusCodes.OK).json(results[0]);
        } else {
          return res.status(StatusCodes.NOT_FOUND).end();
        }
      }
    ); 
  }
}

module.exports = {
  viewAllBooks,
  viewIndividualBook
};