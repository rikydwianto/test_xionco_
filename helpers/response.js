exports.success = function (
  res,
  message = "OK",
  data = null,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.error = function (
  res,
  message = "Terjadi kesalahan",
  error = null,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
