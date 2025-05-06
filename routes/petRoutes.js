const router = require("express").Router();

const Pet = require('../models/Pet')

//Create - criação de dados
router.post('/', async (req, res) => {

    // Verificação de corpo inválido
    if (!req.body) {
        res.status(422).json({ error: 'Corpo da requisição ausente ou inválido (JSON esperado)' });
        return;
    }
       
       const { name, age, weight, color, available, user, adopter } = req.body;
       

    if (!name) {
        res.status(422).json({ error: 'O nome é obrigatório!' });
        return;
    }

    const pet = {
        name,
        age,
        weight,
        color,
        available,
        user,
        adopter
    };

    try {
        await Pet.create(pet);
        res.status(201).json({ message: 'Pet inserido no sistema com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// Read - leitura de dados com filtros opcionais
router.get('/', async (req, res) => {
    const { name, age, weight, color, available, user, adopter } = req.query;

    let filter = {};

    // Adiciona filtro por phone ou nome, se fornecidos
    if (age) {
        filter.phone = { $regex: new RegExp(age, 'i') };
    }
    if (name) {
        // Para busca aproximada (case-insensitive), use RegExp:
        filter.name = { $regex: new RegExp(name, 'i') };
    }

    try {
        const pets = await Pet.find(filter);
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

//leitura dinamica
router.get('/:id', async (req, res) => {
    //extrair o dado da requisição, pela url = req.params
    const id = req.params.id

    try{
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(422).json({message: 'O pet não foi encontrado!'})
            return;
        }

        res.status(200).json(pet)

    } catch (error) {
        res.status(500).json({ erro: error})
    }

})

// Update - atualização dos dados (PATCH)
router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    const { name, age, weight, color, available, user, adopter } = req.body;

    const pet = {
        name,
        age,
        weight,
        color,
        available,
        user,
        adopter
    };

    try {
        const updatedPet = await Pet.findOneAndUpdate(
            { _id: id },
            pet,
            { new: true } // retorna o documento já atualizado
        );

        if (!updatedPet) {
            return res.status(422).json({ message: 'O pet não foi encontrado!' });
        }

        res.status(200).json(updatedPet);

    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

    // Delete - deletar dados
router.delete('/:id', async (req, res) => {

    const id = req.params.id;

    const pet = await Pet.findOne({_id: id})

    try{

        await Pet.deleteOne({_id: id})

        if(!pet) {
            res.status(422).json({message: 'O pet não foi encontrado!'})
            return;
        }

        res.status(200).json({message: 'Pet removido com sucesso'})
        
    }catch(error){
        res.status(500).json({ erro: error})
    }
})

module.exports = router;