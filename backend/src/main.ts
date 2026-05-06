import { env } from '@config/env.config.js';
import express from 'express';

const app = express();

app.use(express.json());

app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
})