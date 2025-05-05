//config inicial
require('dotenv').config()
const express = require('express') //importa o express
const mongoose = require('mongoose') // importa mongoose
const app = express() //inicializa a aplicação

//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json()) //permite ler json

// rotas da API
const usuarioRoutes = require('./routes/usuarioRoutes')

app.use('/usuario', usuarioRoutes)

//rota inicial / endpoint
app.get('/', (req, res) => {

    //mostrar req

    res.json({ message: 'Oi Express!' })

})

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

//entregar uma porta
mongoose
    .connect(
        //Conectar usando um arquivo .env
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@api-parte1.pqv2ajh.mongodb.net/?retryWrites=true&w=majority&appName=api-parte1`
    )
    .then(() =>{
        console.log("Conectamos ao MongoDB!")
        app.listen(3000)
    })

    .catch((err) => console.log(err))
