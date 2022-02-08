exports.middlewareGlobal = (req, res, next) =>{
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user
    next()
}

exports.outroMiddleware = (req, res, next) =>{
    console.log()
    console.log('Sou o novo outro middleware Global')
    console.log()
    next()
}

//Criando erro da falta do token
exports.checkCsrfError = (err, req, res, next) =>{
    if(err){
        return res.render('404')
    }
    next()
}

//Criando token, agora basta inserir em nossos formulários
exports.csrfMiddleware = (req, res, next) =>{
    res.locals.csrfToken = req.csrfToken()
    next()
}

exports.loginRequired = (req, res, next) =>{
    if(!req.session.user){
        req.flash('errors', 'Você precisa fazer login')
        req.session.save(() => res.redirect('/'))
        return
    }
    next()
}