const auth = (req, res, next) => {
  const userId = req.header('X-User-ID');
  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  req.user = { id: userId };
  next();
};

module.exports = auth;