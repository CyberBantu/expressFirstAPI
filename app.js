import express from 'express';
import driversRouter from './routes/drivers.js';
import teamsRouter from './routes/teams.js';


const baseAPIRoute = '/api/v1';
const app = express(); // objeto de controle

app.use(express.json());
app.use( baseAPIRoute + '/drivers', driversRouter);
app.use( baseAPIRoute + '/teams', teamsRouter);

const port = 3000;

app.listen(port, () => console.log('API Funcionando na porta 3000'))