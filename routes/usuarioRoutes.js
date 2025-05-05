const router = require("express").Router();

const Usuario = require('../models/Usuario')

//Create - criação de dados
router.post('/', async (req, res) => {

    // Verificação de corpo inválido
    if (!req.body) {
        res.status(422).json({ error: 'Corpo da requisição ausente ou inválido (JSON esperado)' });
        return;
    }
       
       const { name, email, password, phone, createdAt, updatedAt } = req.body;
       

    if (!name) {
        res.status(422).json({ error: 'O nome é obrigatório!' });
        return;
    }

    const usuario = {
        name,
        email,
        password,
        phone,
        createdAt,
        updatedAt
    };

    try {
        await Usuario.create(usuario);
        res.status(201).json({ message: 'Usuario inserido no sistema com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// Read - leitura de dados com filtros opcionais
router.get('/', async (req, res) => {
    const { name, email, password, phone } = req.query;

    let filter = {};

    // Adiciona filtro por phone ou nome, se fornecidos
    if (phone) {
        filter.phone = { $regex: new RegExp(phone, 'i') };
    }
    if (name) {
        // Para busca aproximada (case-insensitive), use RegExp:
        filter.name = { $regex: new RegExp(name, 'i') };
    }

    try {
        const usuarios = await Usuario.find(filter);
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

//leitura dinamica
router.get('/:id', async (req, res) => {
    //extrair o dado da requisição, pela url = req.params
    const id = req.params.id

    try{
        const usuario = await Usuario.findOne({_id: id})

        if(!usuario) {
            res.status(422).json({message: 'O usuario não foi encontrado!'})
            return;
        }

        res.status(200).json(usuario)

    } catch (error) {
        res.status(500).json({ erro: error})
    }

})

// Update - atualização dos dados (PATCH)
router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    const { name, email, password, phone } = req.body;

    const usuario = {
        name,
        email,
        password,
        phone
        // Não incluímos createdAt nem updatedAt aqui,
        // pois updatedAt será tratado automaticamente pelo middleware
    };

    try {
        const updatedUsuario = await Usuario.findOneAndUpdate(
            { _id: id },
            usuario,
            { new: true } // retorna o documento já atualizado
        );

        if (!updatedUsuario) {
            return res.status(422).json({ message: 'O usuario não foi encontrado!' });
        }

        res.status(200).json(updatedUsuario);

    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

    // Delete - deletar dados
router.delete('/:id', async (req, res) => {

    const id = req.params.id;

    const usuario = await Usuario.findOne({_id: id})

    try{

        await Usuario.deleteOne({_id: id})

        if(!usuario) {
            res.status(422).json({message: 'O usuario não foi encontrado!'})
            return;
        }

        res.status(200).json({message: 'Usuario removido com sucesso'})
        
    }catch(error){
        res.status(500).json({ erro: error})
    }
})

module.exports = router;