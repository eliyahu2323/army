const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './env/config.env' });
const app = require('./app');

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHADLER REJECTION 💥 Shuting down...`);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
