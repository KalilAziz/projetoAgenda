require('dotenv').config() //Variáveis de ambiente que estão configuradas no nosso arquivo .env, tendo senha, usuários. Coisas relacionadas com o ambiente de desenvolvimento que não queremos publicar em um repositório. E quando formos colocar nosso sistema para proução, iremos criar um arquivo .env no servidor, onde nenhum desenvolvedor irá conseguir baixar e pegar nossos dados.
const express = require('express') //importando express
const app = express()//importando express

const mongoose = require('mongoose') //Importou o mongoose, responsável por modelar nossa base de dados e garantir que os dados que iremos salver em nossa base de dados seja da forma correta que devemos salvar. Ele retorna uma promises, por isso iremos usar o .then para que a base de dados seja conectada primeiro antes que a aplicação
mongoose.connect(process.env.CONNECTIONSTRING,{
    //useNewUrlParse: true,
    //useUnifiedTopology: true,
    //useFindAndModify: false
})
    .then(()=> {
        console.log('Base de dados conectada') //Para vermos que foi inicializado
        app.emit('conectado') //Iremos emitir um sinal, onde que iremos capturar esse sinal na hora de executar o sistema, onde apenas se o sinal for gerado, iremos executar nossa aplicação
    })
    .catch( e => { //Tratamento de dados
        console.log('Erro')
    })


const session = require('express-session') //importando express-session, que ficará responsável por salvar um id do cookie no computador do cliente, e toda vez que ele conectar no servidor, ele irá mandar o cookie, e iremos checar nosso id existe no cookie, caso sim, iremos executar algumas ações

const MongoStore = require('connect-mongo') //importando connect-mongo, que serve para falar que as sessões irão ser salvas dentro de nossa base de dados, já que por padrão elas são salvas em memória, e se utilizar a memória de um servidor de produiçào, iremos ficar sem memória rapidamente.

const flash = require('connect-flash') //importando connect-flash, sendo as menssagens auto-destrutivas, onde elas irão ser apagadas assim que serem lidas pela primeira vez. Um exemplo é a tela de senha incorreta do facebook, que se reiniciar a pagina, ela mostrará novamente a tela de login, como se nada tivesse acontecido

const routes = require('./routes') //importando routes, sendo as rotas de nossa aplicação, sendo /Home, /Contato...

const path = require('path') //importando path, que iremos trabalhar com caminhos

const helmet = require('helmet') //importando helmet, sendo uma recomendação do próprio pessoal do express, lembrando que temos que desativar até que subimos para uma hospedagem real

const csrf = require('csurf') //importando csrf, serve para criar tokens para nossos formulários, tendo um imput carregando a variável do token, para que possamos proteger nosso sitema e que ele não seja atacado por Hakers, fazendo que nenhum site ou aplicação externa consiga postar ou editar qualquer coisas dentro da nossa aplicação.

const {middlewareGlobal, outroMiddleware, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware')//São nossos Middleware, que estamos importando de nossa pasta específica que criamos. Lembrando que middleware são funcões que são executadas na rota

//app.use(helmet)//Estamos usando helmet, que devemos deixar comentado até subir o sistema para nosso servidor

app.use(express.urlencoded({ extended: true})) //Estamos permitindo postar formulários para dentro da nossa aplicação.

app.use(express.json())// Muito utilizado para que possamos utilizar o parse de Json na nossa aplicaçào.

app.use(express.static(path.resolve(__dirname, 'public')))//Estamos identificando onde ficará todos os arquivos estáticos da nossa aplicação, que podem ser acessados diretamente, por exemplo: Imagens, CSS, JavaScript

//configurando as sessões, com tempos de duração, entre outros
const sessionOptions = session({
    secret: 'advasdasdvasdvasdv', //Podemos colocar o que quiser
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24*7 //Tempo que o cookie irá durar, durando 7 dias nesse exemplo
    }
})
app.use(sessionOptions)


app.use(flash())//Usando e inicializando o flash, sendo as menssagens auto destrutivas

//views
app.set('views', path.resolve(__dirname, 'src', 'views'))// Sendo os arquivos que renderizamos na tela, sendo normalmente arquivos HTML que temos que colocar como .ejs
app.set('view engine', 'ejs') // É a engine que estamos utilizando para renderizar esses arquivos HTML

app.use(csrf()) //Usando e inicializando o csrf

//Nossos próprios middlewares
app.use(middlewareGlobal)
app.use(outroMiddleware)
app.use(checkCsrfError)
app.use(csrfMiddleware)

app.use(routes)////Usando e inicializando as rotas

//Estamos escutando o sinal, para que quando ele for liberado, nosso sistema execute na porta 3000
app.on('conectado', ()=> {
    app.listen(3000,()=>{
        console.log('Acessar http://localhost:3000')
        console.log('Sevidor executando na porta 3000')
    })
} )
