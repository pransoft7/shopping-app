const User = require('../models/user.model');
const authUtil = require('../util/auth.util');
const validateUtil = require('../util/validation.util');
const sessionFlash = require('../util/sessionFlash.util');

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      fullname: "",
      street: "",
      postal: "",
      city: ""
    }
  };

  res.render('customer/auth/signup', { inputData: sessionData });
};

async function signup(req, res, next) {
    const { email, confirmEmail, password, confirmPassword, fullname, street, postal, city } = req.body;
    
    const enteredData = {
      email,
      confirmEmail,
      password,
      confirmPassword,
      fullname,
      street,
      postal,
      city
    }

    const user = new User(email, password, fullname, street, postal, city);
    if (!validateUtil.validateUserDetails(email, password, fullname, street, postal, city)
        || !validateUtil.isEmailConfirmed(email, req.body.confirmEmail)
        || !validateUtil.isPasswordConfirmed(password, req.body.confirmPassword)) {
          sessionFlash.flashDataToSession(req, {
            errorMessage: "Please check your inputs and enter valid data.",
            ...enteredData
          }, function() {
            return res.redirect('/signup');
          })
    }
    try {
      const existsAlready = await user.userExists();
      if (existsAlready) {
        sessionFlash.flashDataToSession(
          req, 
          {
            errorMessage: "User already exists. Login instead.",
            ...enteredData
          },
          function() {
            return res.redirect('/signup');
          }
        );
      }
      await user.signup();
    } catch (error) {
      return next(error);
    }

    res.redirect('/login');
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: ""
    }
  }

  res.render('customer/auth/login', { inputData: sessionData });
};

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = new User(email, password);
  let existingUser;
  try {
    existingUser = await user.getUserWithEmail();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage: "Invalid email or password.",
    email,
    password
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(
      req, sessionErrorData,
      function() {
        return res.redirect('/login');
      }
    );
  }
  const isCorrectPassword = await user.isCorrectPassword(existingUser.password);
  if (!isCorrectPassword) {
    sessionFlash.flashDataToSession(
      req, sessionErrorData,
      function() {
        return res.redirect('/login');
      }
    );
  }
  authUtil.createUserSession(req, existingUser, function() {
    res.redirect('/');
  });
}

function logout(req, res) {
  authUtil.destroyUserSession(req);
  res.redirect('/login');
}

module.exports = {
    getSignup,
    getLogin,
    signup,
    login,
    logout
}