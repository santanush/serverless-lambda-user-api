const { v4: uuidv4 } = require('uuid');
var _ = require('lodash');
const dateFormat = require('dateformat');
const APIResponse = require("./ApiResponse.js");

module.exports = {
	async currentDateTimeString(){
      let day=dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
      return day;
	},
  async getcurrentDateString(){
    let day=dateFormat(new Date(), "yyyy-mm-dd");
    return day;
  },
  async generateTempKey(){
    var uuid = uuidv4()
    let key = await this.currentDateTimeString();
    return uuid + ":" + key;
  },
  constructAPIResponseError(error){
    return new APIResponse({
                success: false,
                message : this.constructErrorJson(error),
                info : {
                    type : 'error'
                }
        });     
  },
  constructAPIResponseBusinessError(errorMsg){
      return new APIResponse({
                success: false,
                message : errorMsg,
                info : {
                    type : 'error'
                }
        });     
  },
  constructAPIResponseSuccess(obj, msg){        
    return new APIResponse({
             success: true,
             extras: obj,
             message : msg?msg:'Successfully API called',
             info : {
                 type : 'success'
             }
     });     
 },
 constructErrorJson(error){
  let err = error.stack.substring(0,500)
  return err;
}

}


