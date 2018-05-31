/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
var expressValidator = require('express-validator');

/* importar o módulo do express-session */
var expressSession = require('express-session');

/* iniciar o objeto do express */
var app = express();

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));

/* configurar o middleware express-validator e session */
app.use(expressValidator());
app.use(expressSession({
	secret: 'O céu resplandece ao meu redor', /* id do cookie de sessão que da acesso autenticação ao lado do servidor */
	resave: false, /* se verdadeira faz a regravação da sessão mesmo não tendo modificações */
	saveUninitialized: false, /* se verdadeira criar uma sessão nova sempre que for modificada */
	cookie: { maxAge: 1 * 60 * 60 * 1000}
}));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	.then('config/dbConnection.js')
	.then('app/models')
	.then('app/controllers')
	.into(app);

/* exportar o objeto app */
module.exports =  app;