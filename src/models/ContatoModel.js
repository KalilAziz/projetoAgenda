const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    //titulo: String mas podemos mandar mais de uma configuração
    nome: {type: String, required: true},//necessário}
    sobrenome: {type: String, required: false, default: ''},
    email: {type: String, required: false},
    telefone: {type: String, required: false},
    criadoEm: {type: Date, default: Date.now()},
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)


class Contato {
    constructor(body){
        this.body = body
        this.erros = []
        this.contato = null
    }
    async register(){
        this.valida()
        if(this.erros.length > 0) return
        this.contato = await ContatoModel.create(this.body)
    }

    valida(){
        this.cleanUp()
        //validação
        //O e-mail precisa ser válido
        //Iremos instalar um pacote que faz a validação: npm i validator e iremos importar
        if(this.body.email && !validator.isEmail(this.body.email)) this.erros.push('Email inválido')
        if(!this.body.nome) this.erros.push('Nome é um campo obrigatório')
        if(!this.body.email && !this.body.telefone) {
            this.erros.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.')
        }

    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        }
    }

    static async buscaPorId(id){
        if(typeof id !== 'string') return

        const contato = await ContatoModel.findById(id)
        return contato 
        
    }

    static async buscaContatos(){
        const contatos = await ContatoModel.find().sort({ criadoEm: -1 })
        return contatos 
        
    }

    async edit(id){
        if(typeof id !== 'string') return
        this.valida()
        if(this.erros.length > 0) return
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true})
    }

    static async delete(id){
        if(typeof id !== 'string') return
        const contato = await ContatoModel.findOneAndDelete({_id: id})
        return contato
    }
}



module.exports = Contato

