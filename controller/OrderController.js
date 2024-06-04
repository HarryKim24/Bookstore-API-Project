const authorizationJwt = require('../auth');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
  const conn = await mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'Bookstore',
    dateStrings : true
  });

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
    const {items, delivery, total_price, total_count, rep_book_title} = req.body;

    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);
    let delivery_id = results.insertId;
  
    sql = `INSERT INTO orders (book_title, total_count, total_price, user_id, delivery_id) 
            VALUES (?, ?, ?, ?, ?)`;
    values = [rep_book_title, total_count, total_price, authorization.id, delivery_id];
    [results] = await conn.execute(sql, values);
    let order_id = results.insertId;
  
    sql = `SELECT book_id, count FROM cartItems WHERE id IN (?)`;
    let [orderItems, fields] = await conn.query(sql, [items]);
  
    sql = `INSERT INTO orderedBook (order_id, book_id, count) VALUES ?`
    values = [];
    orderItems.forEach((item) => {
      values.push([order_id, item.book_id, item.count]);
    })
    results = await conn.query(sql, [values]);
  
    let result = await deleteCartItems(conn, items);
  
    return res.status(StatusCodes.OK).json(result);
  }
}

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;

  let result = await conn.query(sql, [items]);
  return result;
}

const viewOrders = async (req, res) => {
  const conn = await mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'Bookstore',
    dateStrings : true
  });

  let sql = `SELECT orders.id, created_at, address, receiver, contact, 
              book_title ,total_count, total_price
              FROM orders LEFT JOIN delivery
              ON orders.delivery_id=delivery.id;`;

  let [rows, fields] = await conn.query(sql);
  return res.status(StatusCodes.OK).json(rows);
}

const viewOrderDetail = async (req, res) => {
  const orderId = req.params.id;

  const conn = await mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'Bookstore',
    dateStrings : true
  });

  let sql = `SELECT book_id, title, author, price, count
              FROM orderedBook LEFT JOIN books
              ON orderedBook.book_id=books.id
              WHERE order_id=?`;

  let [rows, fields] = await conn.query(sql,[orderId]);
  return res.status(StatusCodes.OK).json(rows);
}

module.exports = {
  order,
  viewOrders,
  viewOrderDetail
};