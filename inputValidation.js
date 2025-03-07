import Joi from 'joi'; // importando o joi


// Separando os modelos
const driverSchema = Joi.object({ // criando um schema e colocando campos obrigatorios
    name: Joi.string().min(3).max(50).required(),
    team: Joi.string().min(3).max(50).required(),
    points: Joi.number().min(0).max(1000).default(0),
});


const updateDriverSchema = Joi.object({ // criando um schema e colocando campos obrigatorios
    name: Joi.string().min(3),
    team: Joi.string().min(3),
    points: Joi.number().min(0),
}).min(1); // minimo de 1 campo


//criando uma clousere
// criando função unica de validação
function validation(schema) {
    return function validateInfo(info) {
        return schema.validate(info, {abortEarly : false}); // validando o schema // se nao tem nada como undefined nao tem erro
    }
}

export const validadeDriverInfo = validation(driverSchema); // validando o schema
export const validadeUpdateDriverInfo = validation(updateDriverSchema); // validando o schema

const generatePositionSchema = (maxValue) => 
    Joi.number().min(1).max(maxValue); // criando um schema e colocando campos obrigatorios

export const validatePosition = (position, maxValue) =>  
    generatePositionSchema(maxValue).validate(position); // validando o schema
