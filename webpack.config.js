const path = require('path')

module.exports = {
    mode: 'production', //Temos dois mode`s, o development gera um arquivo inteiro, com comentários em geral, e o segundo módulo é o production, onde vai minificar nosso código, deixando mais performático
    entry: './frontend/main.js', //Arquivo de entra 
    output: {
        path: path.resolve(__dirname, 'public', 'assets', 'js'),//Selecionar a pasta que conterá nosso bundle. Estamos usando o __dirname, pois ele chegará automaticamente na pasta desejada, pois tem sistemas que utilizam as barras de navagação entre arquivos de forma diferente
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            exclude: /node_modules/, //Estamos colocando o webpack para não analisar a pasta do node, pois tem muitos arquivos que não precisa de uma análise
            test: /\.js$/, //Testar o arquivo para analisar e formar o bundle
            use: {
                loader: 'babel-loader',
                options:{
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /\.css/,
            use: ['style-loader', 'css-loader'] //npm install style-loader css-loader
        }]
    },
    devtool: 'source-map'
}