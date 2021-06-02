const jwt             = require('jsonwebtoken')
const dbConnection    = require('../DB/connectDB');
const mongoose        = require('mongoose');
const UserToken       = require('../Model/apiModel').UserToken;
module.exports = {
  generateAuthToken: function (userid, key) {   
    const token = jwt.sign({ _id: userid, _key: key }, process.env.JWT_TOKEN_KEY, { expiresIn: '1800s' })  
    //const token1 = jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });  
    return token
  },
  saveAuthToken: async function (userid, key, token) {
    await dbConnection(process.env.MONGODB_URL_API);
    const dataToSave = {userid: userid, tempkey:key, token: token }
    let userToken = await UserToken.create(dataToSave);
    return userToken
  },

  updateAuthToken: async function (loginid, token , key) {
    await dbConnection(process.env.MONGODB_URL_API);
    const updatedValue = { "token": token, "tempkey" : key}
    let updatedToken = await UserToken.findOneAndUpdate({userid: loginid }, updatedValue);
    return updatedToken
  },

  deleteAuthToken: async function (query) {
    await dbConnection(process.env.MONGODB_URL_API);
    const deletedCount = await UserToken.findOneAndRemove(query);
    return deletedCount
  },

  findAuthToken: async function (loginid) {      
    await dbConnection(process.env.MONGODB_URL_API);
    let userToken = await UserToken.findOne({userid : loginid});
    return userToken
    
  },  

  validateToken: async function (req, res, next) {
    try {
      
      let token = req.headers['x-access-token'] || req.headers['user-token'];
      
      if (token) {
        if (token.startsWith('Bearer ')) {
          token = token.slice(7, token.length);
        }
        
        const decoded_token = jwt.decode(token)
        
        
        await dbConnection(process.env.MONGODB_URL_API);
        let token_saved = await UserToken.findOne({userid : decoded_token._id});
        if(!token_saved){
          return res.json({
            success: false,
            message: 'Invalid token supplied'
          });
        }
        if(!(token_saved == token)){
          return res.json({
            success: false,
            message: 'Token not matching'
          });
        }
        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, decoded) => {
          if (err) {
            return res.json({
              success: false,
              message: 'Token is not valid'
            });
          } else {
            decoded.token = token;
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.json({
          success: false,
          message: 'Auth token is not supplied'
        });
      }

    } catch (error) {
      console.error(error)
    }
  } 
};