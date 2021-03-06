const ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection){
    this._connection = connection();
}

JogoDAO.prototype.geraParametros = function(usuario){
    this._connection.open( function(err, mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            collection.insert({
                usuario: usuario,
                moeda: 15, 
                suditos: 10,
                temor: Math.floor(Math.random() *  1000),
                sabedoria: Math.floor(Math.random() *  1000),
                comercio: Math.floor(Math.random() *  1000),
                magia: Math.floor(Math.random() *  1000)
            });
        });
    });
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
    this._connection.open( function(err, mongoclient){
        mongoclient.collection( 'jogo', function(err, collection){
            collection.findOne( {usuario: usuario}, function(err, result){
                res.render('jogo', {img_casa: casa, jogo: result, msg: msg});
                mongoclient.close();
            });
        });
    });
}

JogoDAO.prototype.acao = function(acao){
        this._connection.open( function(err, mongoclient){
            mongoclient.collection('acao', function(err, collection){
                const date = new Date();
                  var tempo = 0;
                 switch(parseInt(acao.acao)){
                    case 1: tempo = 1 * 60 * 60000;
                        break;
                    case 2: tempo = 2 * 60 * 60000;
                        break;
                    case 3: tempo = 5 * 60 * 60000;
                        break;
                    case 4: tempo = 5 * 60 * 60000;
                        break;
                }
                acao.acao_termina_em = date.getTime() + tempo;
                collection.insert(acao);
            });
            
            mongoclient.collection("jogo", function(err, collection){
                var moedas = 0;
                switch(parseInt(acao.acao)){
                   case 1: moedas = -2 * acao.quantidade;
                       break;
                   case 2:  moedas = -3 * acao.quantidade;
                       break;
                   case 3:  moedas = -1 * acao.quantidade;
                       break;
                   case 4:  moedas = -1 * acao.quantidade;
                       break;
               }
            collection.update(
                {usuario: acao.usuario},
                { $inc: {moeda: moedas}}); // $inc faz um incremento da chave
            });
            mongoclient.close();
        });
}

JogoDAO.prototype.getAcoes = function(usuario, res){
    this._connection.open( function(err, mongoclient){
        mongoclient.collection( 'acao', function(err, collection){
            const date = new Date();
            const data_atual = date.getTime(); // pega esse data para trazer apenas os eventos que ainda estão ocorrendo e não os passados
            collection.find({usuario: usuario, acao_termina_em: {$gt: data_atual}}).toArray(function(err, result){
                res.render('pergaminhos', {acoes: result});
                mongoclient.close();
            });
         });
    });
}

JogoDAO.prototype.revogarAcao = function(_id, res){
    this._connection.open( function(err, mongoclient){
        mongoclient.collection( 'acao', function(err, collection){
          collection.remove(
              {_id: ObjectID(_id)},
              function(error, result){
                  res.redirect("jogo?msg=removeAcao");
                  mongoclient.close();
              }
            );
         });
    });
}

module.exports = function(){
    return JogoDAO;
}
