# Commant to up the server
npm start

# used babel to access es6 features of nodejs

# Folder structure
src -> api -> user (model, route and controller)
src -> api -> services (contains nodemailer and auth verification)

# Generated token will expire in 1 hour

# Endpoints
/user/signup => to register new user
/user/login => to logined registered user
/user/confirmation/:token => to verify email id
/user/list => to get the list of registered users

# used jasonwebtokens to generater and verify token

# used bcryptjs to create hashed password

# used express-validator to validate the input data in body and to check that email must be unique

# used local database