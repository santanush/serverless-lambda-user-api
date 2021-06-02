/*
   Contains all database models
*/
const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  phoneno: { type: String, default: '' },
  loginid: { type: String, default: '' },
  encrypted_password: { type: String, default: '' },
  virtualKey: { type: String, default: '' },
  authToken: { type: String, default: '' }
});
const UserTokenSchema = new Schema({
  userid: { type: String, default: '' },
  tempkey: { type: String, default: '' },
  token: { type: String, default: '' },
  creatTime : {type: Date, default: Date.now()} 
});
const validatePresenceOf = value => value && value.length;

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.virtualKey = this.makeVirtualKey();
    this.encrypted_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });
UserSchema.methods = {
  /**
   * Authenticate - validates plain tet password in the database
   *
   * @param {String} textPassword
   * @return {Boolean}
   * @api public
   */

  authenticate: function(textPassword) {
    return this.encryptPassword(textPassword) === this.encrypted_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  
  makeVirtualKey: function() {
    
    return Math.round(Date.now() * Math.random()) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.virtualKey)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

};

 
module.exports = {
  User                  : mongoose.model("app_user", UserSchema),
  UserToken             :mongoose.model("app_token", UserTokenSchema)
}  
 
 