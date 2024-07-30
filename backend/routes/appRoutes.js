import { Router } from 'express';

const appRouter = Router();

// DUMMY ROUTE
appRouter.get('/', (req, res) => {res.send('API Routes working!')});

export default appRouter;