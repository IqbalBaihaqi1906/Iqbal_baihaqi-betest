// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.code || 500).json({
    success: false,
    error_code: err.code || 500,
    message: err.message || 'internal server error',
  });
};

module.exports = errorHandler;