const jwt = require("jsonwebtoken");

const secert = "@)*&MySecertKey$*&#";

const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    profileImg: user.profileImg,
  };

  const token = jwt.sign(payload, secert);
  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, secert);
  return payload;
};

module.exports = { createTokenForUser, validateToken };
