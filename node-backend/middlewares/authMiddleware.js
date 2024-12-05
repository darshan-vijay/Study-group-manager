// authMiddleware.js
const authenticateUser = (req, res, next) => {
    // Simply skip token verification
    req.clientId = req.body.clientId; // Use clientId from the request body instead
    if (!req.clientId) {
      return res.status(400).json({ error: 'Client ID is missing.' });
    }
    next();
  };
  
  module.exports = authenticateUser;
  