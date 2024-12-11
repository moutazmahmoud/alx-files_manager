import express from 'express';
import router from './routes/index';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

router(app);

app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});

export default app;
