import express from 'express';
import { validadeDriverInfo, validadeUpdateDriverInfo, validatePosition } from '../inputValidation.js'; // importando o joi
import { sortDrivers, drivers, generateTeamsArray } from '../data.js';
import { randomUUID } from 'node:crypto'; // importando a função de gerar id
import Joi from 'joi'; // importando o joi

const router = express.Router(); // criando um router

router.get('/', (req, res) => { // nao coloquei nada pq ja sei que vem de router 
    
    const { error } = validadeDriverInfo(req.body); // validando o schema // se nao tem nada como undefined nao tem erro

    if ( error ) {
        res.status(200).send(sortDrivers); // entregando a lista de drivers quando vir 200
        return;
    }
}
);

// Criando o get por id
router.get("/standings/:position", (req, res) => {
    // Criando um array de times
    const teams = generateTeamsArray(); 

    // Pegando a posição da URL
    const { position } = req.params;
    const numericPosition = Number(position); // Convertendo para número

    // Validando a posição
    const { error } = validatePosition(numericPosition, teams.length);
    if (error) {
        res.status(400).send(error);
        return;
    }

    // Pegando o time na posição informada
    const selectedTeam = teams[numericPosition - 1];

    if (!selectedTeam) {
        res.status(404).send({ message: 'Driver not found' });
        return;
    }

    res.status(200).send(selectedTeam);
});


// idendificando pelo id do piloto
router.get("/:id", (req, res) => {
    const id = req.params.id; // aqui é string pq vem da url
    console.log("ID recebido:", id); 
    console.log("Lista de drivers:", sortDrivers);

    const selectedDriver = sortDrivers.find((driver) => driver.id === id);
    
    if (!selectedDriver) {
        console.log("Driver não encontrado!");
        return res.status(404).send({ message: "Driver not found" });
    }
    
    console.log("Driver encontrado:", selectedDriver);
    res.status(200).send(selectedDriver);
});

// criando um metodo post
router.post("/", (req, res) => {


    // validacao
    const { error } = validadeDriverInfo(req.body) // validando o schema // se nao tem nada como undefined nao tem erro
    
    if (error) { // testando se tem erro
        res.status(400).send(error); // se tiver erro vai mandar a mensagem de erro
        return;
    }

    const newDriver = {...req.body, id: randomUUID()}; // criando um novo driver

 
    
    sortDrivers.push(newDriver); // adicionando o novo driver
    sortDrivers.sort((b, a) => { // ordenando
        if (a.points > b.points) {
            return 1;
        }
        if (a.points < b.points) { // ordenando melhor isso
            return -1;
        }
        return 0;
    });
    res.status(200).send(newDriver);
});


// criando metodo put de atualização
router.put('/:id', (req, res) => {


    //setando o erro
    const {error} = validadeUpdateDriverInfo(req.body); // validando o schema // se nao tem nada como undefined nao tem erro
    
    if (error) {
        res.status(400).send(error); // se tiver erro vai mandar a mensagem de erro
        return;
    }

    const { id } = req.params;
    const selectedDriver = sortDrivers.find(d => d.id === id); // pegando as info

    if (!selectedDriver) {
        res.status(404).send({ message: 'Driver not found' });
        return;
    }
    
    for (const key in selectedDriver) {
        if (req.body[key]) {
            selectedDriver[key] = req.body[key]; // atualizando o valor e veirifcado
        }
    }
    res.status(200).send(selectedDriver);
})

// metodo deletar
router.delete('/:id', (req, res) => {

    const { id } = req.params;
    const selectedDriver = sortDrivers.find(d => d.id === id); // pegando as info
    
    const index = sortDrivers.indexOf(selectedDriver) // identificando o indice
    sortDrivers.splice(index // identificando o indice 
    , 1); // deletando
    res.status(200).send(selectedDriver);
})


export default router; // exportando o router