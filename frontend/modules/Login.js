import validator from 'validator'

export default class login{
    constructor(formClass){
        this.form = document.querySelector(formClass)
        
    }
    init(){
        this.events()
    }
    events(){
        if(!this.form) return
        this.form.addEventListener('submit', (e) =>{
            e.preventDefault()
            this.validate(e)
        })

    }
    validate(e){
        const el = e.target
        const emailInput = el.querySelector('input[name="email"]')
        const passwordInput = el.querySelector('input[name="password"]')
        let error = false

        if(!validator.isEmail(emailInput.value)) {
            error = true
            alert('E-mail inválido')
        }

        if(passwordInput.value.length<3 || passwordInput.value.length>50 ) {
            error = true
            alert('Senha inválida: Precisa ter entre 3 e 50 caracteres')
        }
        console.log(this.error)
        if(!error)el.submit()
    }

}