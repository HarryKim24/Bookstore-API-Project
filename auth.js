const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authorizationJwt = (req, res) => {

  try {
    let receiveJwt = req.headers["authorization"];
    console.log("received jwt : ", receiveJwt);

    if (receiveJwt) {
      let decodedJwt = jwt.verify(receiveJwt, process.env.PRIVATE_KEY);
      console.log(decodedJwt);
      return decodedJwt;
    } else {
      throw new ReferenceError('jwt must be provided');
    }
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
}

module.exports = authorizationJwt;