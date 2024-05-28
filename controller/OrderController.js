const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const order = (req, res) => {
  const {items, delivery, user_id, total_price, total_count, rep_book_title} = req.body;

  let delivery_id = 3;
  let order_id = 2;

  let sql = `INSERT INTO orderedBook (order_id, book_id, count)
            VALUES ?`
  let values = [];
  items.forEach((item) => {
    values.push([order_id, item.book_id, item.count]);
  })

  conn.query(sql, [values],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
  
      return res.status(StatusCodes.OK).json(results);
    }
  );




  // let delivery_id = 3;
  // let order_id;

  // let sql = `INSERT INTO orders (book_title, total_count, total_price, user_id, delivery_id) 
  // VALUES (?, ?, ?, ?, ?)`;
  // let values = [rep_book_title, total_count, total_price, user_id, delivery_id];

  // conn.query(sql, values,
  //   (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(StatusCodes.BAD_REQUEST).end();
  //     }
  
  //     order_id = results.insertId;
  //     console.log(order_id);
  
  //     return res.status(StatusCodes.OK).json(results);
  //   }
  // );




  // let sql = `INSERT INTO delivery (address, receiver, contact) 
  //           VALUES (?, ?, ?)`;
  // let values = [delivery.address, delivery.receiver, delivery.contact];

    // conn.query(sql, values,
  //   (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(StatusCodes.BAD_REQUEST).end();
  //     }

  //     delivery_id = results.delivery_id;

  //     return res.status(StatusCodes.OK).json(results);
  //   }
  // );
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