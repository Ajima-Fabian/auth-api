import jwt from 'jsonwebtoken';

// ---------------------------------------------------
// Generate Access & Refresh Tokens
// ---------------------------------------------------
const generateTokens = (userId) => {
  // Short-lived access token
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  // Long-lived refresh token
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export default generateTokens;