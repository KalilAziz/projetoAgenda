const mongoose = require('mongoose')

const HomeSchema = new mongoose.Schema({
    //titulo: String mas podemos mandar mais de uma configuração
    titulo: {type: String, 
             required: true},//necessário}
    descricao: String
})

const HomeModel = mongoose.model('Home', HomeSchema)

/*
class Home {

}
module.exports = Home
*/
module.exports = HomeModel
//Importar no HomeController