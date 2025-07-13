export default {
  // dbURL: 'mongodb://127.0.0.1:27017',
  dbURL: process.env.MONGO_URL,
  dbName: process.env.DB_NAME
}
