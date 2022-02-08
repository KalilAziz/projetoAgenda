const Login = require('../models/LoginModel')

exports.index = (req, res) =>{
    if(req.session.user) return res.render('login-logado')
    return res.render('login')
}
exports.register = async function (req, res){

    try {

        //req.body//Sempre que postarmos alguma coisa, o req. body irá ser prenchido com os dados do formuário
    const login = new Login(req.body)//Estamos mandando pra classe apra que possamos validar os dados
    await login.register()
    if(login.erros.length > 0){
        req.flash('errors', login.erros)

        req.session.save(() => {
            return res.redirect('back')//Estamos salvando a session e mandando de volta para a página de login
        })
        return
    }
        req.flash('success', 'Seu usuário foi criado com sucesso.')
        req.session.save(() => {
        return res.redirect('back')
        })
        
    } catch (e) {
    return res.render('404')
    }
}

exports.login = async function (req, res){

    try {
        //req.body//Sempre que postarmos alguma coisa, o req. body irá ser prenchido com os dados do formuário
    const login = new Login(req.body)//Estamos mandando pra classe apra que possamos validar os dados
    await login.login()

    if(login.erros.length > 0){
        req.flash('errors', login.erros)

        req.session.save(() => {
            return res.redirect('back')//Estamos salvando a session e mandando de volta para a página de login
        })
        return
    }

        req.flash('success', 'você entrou no sistema.')
        req.session.user = login.user
        req.session.save(() => {
        return res.redirect('back')
        })
        
    } catch (e) {
    return res.render('404')
    }
}

exports.logout = (req, res) =>{
    req.session.destroy()
    res.redirect('/')
}