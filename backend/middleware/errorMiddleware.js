export const notFound = (_req, _res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  res.status(err.status || 500).json({ message: err.message });
};