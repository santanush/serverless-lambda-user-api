# serverless-lambda-user-api (User Authetication using serverless framework and JSON Web Token)
# Overview
This project contains UserManager API developed using **serverless** framework.
This API's can be utilized to start a User Management API. 
This API is integrated with **JWT**. JSON Web Token(JWT) is standard industry based practice for TOKEN based API authetication.
Refere to **https://jwt.io/** for details about JWT Token.

Serveless (reference https://www.serverless.com/) is the Node.js based REST API development fraamework that can be used to develop and deploy 
lambda based API development.

With serverless framework you cna quickly develop your REST API's and deploy in AWS Cloud. 
From your console only you can deploy the developed and tested REST API's on AWS.

# Technology Stack
1. NodeJS12.x
2. MongoDB (MongoDB Compass)
3. jswonwebtoken (https://www.npmjs.com/package/jsonwebtoken)

# Pre requisite
1. Create a MongoDB database and define environment variable MONGODB_URL_API with the database endpoint
2. Create an environment variable called JWT_TOKEN_KEY and use any of your value (String value) that can be utilized to create token in JWT
3. Create another environment variable NODE_ENV that denotes the name of your environment (e.g. dev, test, prod etc.)
4. Create environment variable called REGION with your required AWS region (e.g. ap-south-1, us-east-1 etc.)
5. You need to configure your named profile using AWS CLI.



# API Details
|   API|Description   |Method Type|
|---|---|--|
| /user/ping  |  Ping API to validate the API is running |   GET|
| /user/register | This API is used to register user. On registration |   POST |
|  /user/authenticate| User can use this API to login.  | POST |
|  /user/alluser|  Get all the current user details | GET |
|  /user/get/loginid/{login_id} |  Get the user detail by loginId (mobile no)| GET |
|  /user/logout| User will use the system to logout from the system | POST|

# How JWT is implemented
There are only two methods that will work without the token. 
User Registration and User Authentication.
For user authentication the user passes his loginId and password. API validates if the users existing JWT token in the database.
After successful user authetication it generates a JWT token using randm number, current date time and login id along with custome environment variable JWT_TOKEN_KEY.
Then it checks if there are eixsitng token in the database for this user. If exists it updates the entry with newly generated token otherwise inserts a new record in app_token document.
Authentication method returns this token.

For every other API's consumers need to pass this token in the header with key user-token. Every API uses Authorizationmange.validatetoken method to validate if this token is still valid(not expired)
and matches exactly with the token for that user in the databae. If token matches and did not expire yet it goes for API execution otheriwse return 'Token not valid' or 'Token not matches'

# How to deploy?
For local development use the command **serverless offline start**.
It will deploy the server locally 
   ───────────────────────────────────────────────────────────────────────
                                                                           
     GET  | http://localhost:3000/dev/user/ping                          
      POST | http://localhost:3000/dev/user/register  
     POST | http://localhost:3000/dev/user/logout                         
     POST | http://localhost:3000/dev/user/authenticate                   
     GET  | http://localhost:3000/dev/user/alluser                       
     GET  | http://localhost:3000/dev/user/get/loginid/{login_id}       
                                                                           
   ────────────────────────────────────────────────────────────────────────

For deploying to AWS use the command **serverless deploy**.
It will deploy the API into API Gateway in your AWS account in the region mentioned your serverlss.yml and use the role that is mentioned there.
    
    


