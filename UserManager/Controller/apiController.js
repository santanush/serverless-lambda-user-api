const serverless = require("serverless-http");
const express = require("express");
const app = express();
const AuthorizerManager = require("../Auth/authorization");
const ServiceUtil = require("../util/serviceutil");
const UserService = require("../Service/apiService");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
/**
 *
 */
app.get("/user/ping", function (req, res) {
  res.send(" I am alive !! You pinged me @ " + Date.now());
});

/**
 *
 */
app.get("/user/alluser", AuthorizerManager.validateToken , async (req, res) => {
  
  try {  
   
    let allUsers = await UserService.getAllUser();
    return res
        .status(200)
        .send(
          ServiceUtil.constructAPIResponseSuccess(allUsers)
        );
    
  } catch (error) {
    console.log(error);    
    return res.status(500).send(
      ServiceUtil.constructAPIResponseError(error)
    );
  }
});

//  function for creating a new user
app.post("/user/register", async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    
    const { name, email, username, password, phoneno } = data;
   
    if (
      !data ||
      !data.name ||
      !data.email ||
      !data.username ||
      !data.password ||
      !data.phoneno 
    ) {
      return res
        .status(412)
        .send(
          ServiceUtil.constructAPIResponseBusinessError(
            "Mandatory user parameters missing"
          )
        );
    }

    const dataToSave = {
      name,
      email,
      username,
      password,
      phoneno,
      loginid: phoneno,
    };
    const isExists = await UserService.alreadyExists(email, username, phoneno);
    if (isExists) {
      return res
        .status(409)
        .send(
          ServiceUtil.constructAPIResponseBusinessError(
            "User with provided input already exists"
          )
        );
    }
   
    let createUser = await UserService.createUser(dataToSave);
    if (createUser) {
      return res.status(200).send(ServiceUtil.constructAPIResponseSuccess(createUser));
    }
  } catch (error) {
    console.log(error, "error!!");
    return res.status(500).send(ServiceUtil.constructAPIResponseError(error));
  }
});
//  function to logout
app.post("/user/logout", AuthorizerManager.validateToken , async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    if (!data || !data.loginid) {
      return res
        .status(412)
        .send(
          ServiceUtil.constructAPIResponseBusinessError(
            "You need to pass login id"
          )
        );
    }
    const userid = data.loginid;
    const queryString = { userid: userid };
    const deletedCount = await AuthorizerManager.deleteAuthToken(
      queryString
    );
    if (deletedCount) {
      return res.status(200).send(
        ServiceUtil.constructAPIResponseSuccess({"message":"Logout successful"})
      );
    } else {
      return res
      .status(409)
      .send(
        ServiceUtil.constructAPIResponseBusinessError(
          "Logout unsuccessful"
        )
      );
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(ServiceUtil.constructAPIResponseError(error));
  }
});

//  function to login
app.post("/user/authenticate", async (req, res) => {
  const method = "/usr/authenticate";

  try {
    const data = JSON.parse(req.body);
    const { loginid, password } = data;
    if (!data || !loginid || !password) {
      return res
        .status(412)
        .send(
          ServiceUtil.constructAPIResponseBusinessError(
            "Mandatory user parameters missing"
          )
        );
    }
    // Identify User
    let usercheck = await UserService.validateUser(data);
    // Generate Auth Token
     if (usercheck) {
      let key = await ServiceUtil.generateTempKey();
      let token = await AuthorizerManager.generateAuthToken(loginid, key);
      if (usercheck) {
        // Check if Token already exist
        
        const queryString = { userid: loginid };
       
        let userToken = await AuthorizerManager.findAuthToken(loginid);
      
        if (userToken) { //If token already exists in the database - UPDTE the token
            let updatedUserToken = await AuthorizerManager.updateAuthToken(
            loginid,
            token,
            key
          );
                 
         
        } else {//Token does not exist in database - INSERT new token
         
            // Save Token at Database
            
              let userToken = await AuthorizerManager.saveAuthToken(loginid, key, token);
              token = userToken.token          
          
        }
        let userObj = await UserService.getUserByLoginId(loginid)
        return res.status(200).send(
          ServiceUtil.constructAPIResponseSuccess({user: userObj, token:token})
        );
      }
    } else {
      return res
      .status(412)
      .send(
        ServiceUtil.constructAPIResponseBusinessError("Invalid loginid/password passed or user does not exist")
      );
    }
  } catch (error) {   
    console.log(error, "error!!");
    return res.status(500).send(ServiceUtil.constructAPIResponseError(error));
  }
});
app.get('/user/get/loginid/:login_id', AuthorizerManager.validateToken , async (req, res) => {
  try {  
    let id = req.params.login_id;
    if (!id) {
      return res
        .status(412)
        .send(
          ServiceUtil.constructAPIResponseBusinessError(
            "You need to pass login id"
          )
        );
    }
    let user = await UserService.getUserByLoginId(id);
    if(user){
      return res
          .status(200)
          .send(
            ServiceUtil.constructAPIResponseSuccess(user)
          );
    }else{
      return res
      .status(412)
      .send(
        ServiceUtil.constructAPIResponseBusinessError(
          "This login id does not exist"
        )
      );
    }
    
  } catch (error) {
    console.log(error);    
    return res.status(500).send(
      ServiceUtil.constructAPIResponseError(error)
    );
  }
});
//  function for creating a new product
module.exports.handler = serverless(app);
