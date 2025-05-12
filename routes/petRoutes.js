const router = require("express").Router();
const Pet = require('../models/Pet');
const checkToken = require('../middleware/checkTokens');

// ✅ Rota POST para cadastro de pets (*validar token)
router.post('/', checkToken, async (req, res) => {
    const { name, age, weight, color, available } = req.body;

    if (!name) {
        return res.status(422).json({ error: 'O nome é obrigatório!' });
    }

    const pet = new Pet({
        name,
        age,
        weight,
        color,
        available,
        user: req.userId,
        adopter: null
    });

    try {
        await pet.save();
        res.status(201).json({ message: 'Pet inserido no sistema com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// ✅ Rota GET que retorne todos os pets
router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// ✅ Rota GET que retorne todos os pets do usuário logado (*validar token)
router.get('/mypets', checkToken, async (req, res) => {
    try {
        const pets = await Pet.find({ user: req.userId });
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// ✅ Rota GET que retorne um pet por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const pet = await Pet.findById(id);
        if (!pet) {
            return res.status(422).json({ message: 'Pet não encontrado' });
        }
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// ✅ Rota PATCH para atualizar pet (*validar token)
router.patch('/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const pet = await Pet.findById(id);

    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });
    if (pet.user.toString() !== req.userId) return res.status(403).json({ message: 'Acesso negado' });

    const { name, age, weight, color, available } = req.body;

    try {
        const updatedPet = await Pet.findByIdAndUpdate(id, {
            name,
            age,
            weight,
            color,
            available
        }, { new: true });

        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// ✅ Rota DELETE para deletar pet (*validar token)
router.delete('/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const pet = await Pet.findById(id);

    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });
    if (pet.user.toString() !== req.userId) return res.status(403).json({ message: 'Acesso negado' });

    try {
        await Pet.findByIdAndDelete(id);
        res.status(200).json({ message: 'Pet removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// ✅ Rota PATCH para agendar uma visita (*validar token)
router.patch('/schedule/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    try {
        const pet = await Pet.findById(id);
        if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });

        if (pet.user.toString() === req.userId)
            return res.status(422).json({ message: 'Você não pode agendar visita para seu próprio pet.' });

        if (pet.adopter) return res.status(422).json({ message: 'Pet já está agendado para adoção.' });

        pet.adopter = req.userId;
        await pet.save();

        res.status(200).json({ message: 'Visita agendada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// ✅ Rota PATCH para concluir uma adoção (*validar token)
router.patch('/adopt/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    try {
        const pet = await Pet.findById(id);
        if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });

        if (pet.user.toString() !== req.userId)
            return res.status(403).json({ message: 'Apenas o dono do pet pode concluir a adoção.' });

        if (!pet.adopter)
            return res.status(422).json({ message: 'Nenhum adotante para este pet.' });

        pet.available = false;
        await pet.save();

        res.status(200).json({ message: 'Adoção concluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
