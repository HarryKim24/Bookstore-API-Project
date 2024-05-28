const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const order = (req, res) => {
  res.json('주문');
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