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

  const {items, delivery, user_id, total_price, total_count, rep_book_title} = req.body;

  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  let delivery_id = results.insertId;

  sql = `INSERT INTO orders (book_title, total_count, total_price, user_id, delivery_id) 
          VALUES (?, ?, ?, ?, ?)`;
  values = [rep_book_title, total_count, total_price, user_id, delivery_id];
  [results] = await conn.execute(sql, values);
  let order_id = results.insertId;

  sql = `INSERT INTO orderedBook (order_id, book_id, count) VALUES ?`
  values = [];
  items.forEach((item) => {
    values.push([order_id, item.book_id, item.count]);
  })
  results = await conn.query(sql, [values]);

  return res.status(StatusCodes.OK).json(results[0]);
}

const viewOrders = (req, res) => {
  res.json('주문 목록 조회');
}

const viewOrderDetail = (req, res) => {
  res.json('주문 상세 조회');
}

module.exports = {
  order,
  viewOrders,
  viewOrderDetail
};