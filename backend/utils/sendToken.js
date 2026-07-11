const sendToken = (user, statusCode, res) => {

  const token = user.getJWTToken();

  const isCrossOrigin = process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes("localhost");

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: isCrossOrigin ? "none" : "lax",
    secure: isCrossOrigin,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

export default sendToken