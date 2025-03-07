import express from 'express';
import { generateTeamsArray } from '../data.js';
import { validatePosition } from '../inputValidation.js';


const router = express.Router(); // criando um router

// Criando o get criando outra por para teams
router.get('/', (req, res) => { // sem nada pq ja sei que vem de router
    res.status(200).send(generateTeamsArray()); // entregando a lista de drivers quando vir 200 -- usando a funçãp pra gerar a taneça
}
);


router.get("/standings/:position", (req, res) => { // criando o get por id sem coloca teams como rota direta

    // criando um schema para validar
    const teams = generateTeamsArray(); // puxando a função para fazer o calculo
  //  const positionSchema = Joi.number().min(1).max(teams.length); // criando um schema e colocando campos obrigatorios
    const { error } = validatePosition(position, teams.length); // validando o schema // se nao tem nada como undefined nao tem erro
    if (error) {
        res.status(400).send(error); // se tiver erro vai mandar a mensagem de erro
        return
    }
    //pegando a posição
    const {position} = req.params;
    const selectedteams = teams[position - 1] 

    if (!selectedteams) {
        res.status(404).send({ message: 'Driver not found' });
        return; 
    }

    res.status(200).send(selectedteams);
});


export default router; // exportando o router