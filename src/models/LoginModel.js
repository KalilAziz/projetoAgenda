
const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs') //npm i bcryptjs pacote para proteger nossa senha
const LoginSchema = new mongoose.Schema({
    //titulo: String mas podemos mandar mais de uma configuração
    email: {type: String, required: true},//necessário
    password: {type: String, required: true}
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body){
        this.body = body
        this.erros = [] //Iremos colocar essa array, para que se tiver algum erro aqui dentro, não iremos poder cadastrar os usuários no nosso banco de dados
        this.user = null
    }
    async login(){
        this.valida()
        if(this.erros.length > 0) return
        this.user = await LoginModel.findOne({ email: this.body.email })

        if(!this.user) {
            this.erros.push('Usuário não existe.')
            return
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.erros.push('Senha inválida')
            this.user = null
            return
        }
    }

    async register(){
        this.valida()
        if(this.erros.length > 0) return

        await this.userExists()

        if(this.erros.length > 0) return

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        this.user = await LoginModel.create(this.body)
    
    }

    valida(){
        this.cleanUp()
        //validação
        //O e-mail precisa ser válido
        //Iremos instalar um pacote que faz a validação: npm i validator e iremos importar
        if(!validator.isEmail(this.body.email)) this.erros.push('Email inválido')

        //A senha precisa ter entre 3 e 50
        if(this.body.password.length < 3 || this.body.password.length > 50) {
            this.erros.push('Senha inválida, precisa ter entre 3 e 50 caracteres.')
        }

    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }

    async userExists(){
        this.user = await LoginModel.findOne({ email: this.body.email })//Estamos buscando na base de dados um email que seja igual ao nosso email
        if(this.user) this.erros.push('Usuário já cadastrado.')
    }

}

module.exports = Login

