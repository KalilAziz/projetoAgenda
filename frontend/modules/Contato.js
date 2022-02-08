import validator from 'validator'

export default class Contato{

    constructor(){
        this.contatoForm = document.querySelector('.formContato')
    }
    init(){
        this.events()
    }
    events(){
        if(!this.contatoForm) return 
        this.contatoForm.addEventListener('submit', e => {
            e.preventDefault();
            this.valida(e)
        })
    }
    valida(e){
        
        const el = e.target
        const nomeContato = document.querySelector('.nomeContato')
        const sobrenomeContato = document.querySelector('.sobrenomeContato')
        const emailContato = document.querySelector('.emailContato')
        const telefoneContato = document.querySelector('.telefoneContato')
        let erro = false
        if(!nomeContato.value) {
            erro = true
            return alert('Campo nome vazio')
        }
        if(!telefoneContato.value || !validator.isEmail(emailContato.value)){
            erro = true
            return alert('Preencha um dos campos: Email ou contato')
        }
        if(!erro)el.submit()
    }
}