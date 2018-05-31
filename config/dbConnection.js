/* importar o momboDb */
const mongo = require('mongodb');

const connMongoDB = function(){
    console.log("Entrou na Funcao de Conexão");
    const db = new mongo.Db(
        'got', /* nome do banco */
        new mongo.Server(
           'localhost', /* endereço do servidor */
           27017, /*porta de conexão */
            {} /* configurações adicionais */ 
        ),
        {} /* configurações adicionais */
    )
    return db;
}

module.exports = function(){
   return connMongoDB;
}