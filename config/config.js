require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  clientURL: process.env.CLIENT_URL,
  mongodbURI: process.env.MONGODB_URI + 'your-DB?retryWrites=true&w=majority' || 'mongodb://localhost:27017/your-DB',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  isProduction: process.env.NODE_ENV === 'production',
};