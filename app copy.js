import express from 'express';
import { sortDrivers, generateTeamsArray, drivers } from './data.js';
import { randomUUID } from 'node:crypto'; // importando a função de gerar id
import { validadeDriverInfo, validadeUpdateDriverInfo, validatePosition } from './inputValidation.js'; // importando o joi
import Joi from 'joi'; // importando o joi


const baseAPIRoute = '/api/v1';
const app = express(); // objeto de controle

//função Middleware
app.use(express.json());

// Criando o get
app.get(baseAPIRoute + '/drivers', (req, res) => {
    
    const { error } = validadeDriverInfo(req.body); // validando o schema // se nao tem nada como undefined nao tem erro

    if ( error ) {
        res.status(200).send(sortDrivers); // entregando a lista de drivers quando vir 200
        return;
    }
}
);

// Criando o get criando outra por para teams
app.get(baseAPIRoute + '/teams', (req, res) => {
    res.status(200).send(generateTeamsArray()); // entregando a lista de drivers quando vir 200 -- usando a funçãp pra gerar a taneça
}
);


// Criando o get por id
app.get(baseAPIRoute + "/drivers/standings/:position", (req, res) => {

    // criando um schema para validar
    const {position} = req.params;
    const { error } = validadeDriverInfo(position, drivers.length); // validando o schema // se nao tem nada como undefined nao tem erro


    if (error) {
        res.status(400).send(error); // se tiver erro vai mandar a mensagem de erro
        return
    }
    //pegando a posição
    
    const selectedDriver = sortDrivers[position - 1] 

    if (!selectedDriver) {
        res.status(404).send({ message: 'Driver not found' });
        return; 
    }

    res.status(200).send(selectedDriver);
});


app.get(baseAPIRoute + "/teams/standings/:position", (req, res) => {

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




// idendificando pelo id do piloto
app.get(baseAPIRoute + "/drivers/:id", (req, res) => {

    const { id } = req.params;
    const selectedDriver = sortDrivers.find((driver) => driver.id === id);
    
    if (!selectedDriver) {
        res.status(404).send({ message: 'Driver not found' });
        return;
    }
    
    res.status(200).send(selectedDriver);
})

// criando um metodo post
app.post(baseAPIRoute + "/drivers", (req, res) => {


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
app.put(baseAPIRoute + '/drivers/:id', (req, res) => {


    //setando o erro
    const {error} = validadeUpdateDriverInfo
    
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
app.delete(baseAPIRoute + '/drivers/:id', (req, res) => {

    const { id } = req.params;
    const selectedDriver = sortDrivers.find(d => d.id === id); // pegando as info
    
    const index = sortDrivers.indexOf(selectedDriver) // identificando o indice
    sortDrivers.splice(index // identificando o indice 
    , 1); // deletando
    res.status(200).send(selectedDriver);
})

const port = 3000;

app.listen(port, () => console.log('API Funcionando na porta 3000'))