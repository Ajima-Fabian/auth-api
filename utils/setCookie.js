// ---------------------------------------------------
// Store refresh token in secure HTTP-only cookie
// ---------------------------------------------------
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,

    // Only HTTPS in production
    secure: process.env.NODE_ENV === 'production',

    // Helps prevent CSRF attacks
    sameSite: 'strict',

    // Cookie lifespan
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default setRefreshTokenCookie;