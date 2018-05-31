function UsuariosDAO(connection){
      this._connection = connection(); //pegando a conexão e deixando disponivel para as outras funçoes
}

UsuariosDAO.prototype.inserirUsuario = function(usuario, req, res){
    this._connection.open( function(err, mongoclient){ // abrindo a conexão com o banco
        mongoclient.collection("usuarios", function(error, collection){ // passando a collection desejada
            collection.insert(usuario);
            res.render('cadastro', {validacao: usuario, dadosForm: {}});
        });
    });
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(error, collection){
           // collection.find({usuario: usuario.usuario, senha: usuario.senha}); 
            collection.find(usuario).toArray(function(err, result){ // essa ação é equivalante a de cima, mas como a estrutura de json enviado é mesma que esta no banco pode-se omitir os valores
                if(!!result[0]){
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                    res.redirect("jogo"); /* indo para a tela jogo */
                }else{
                    res.render("index", {validacao: usuario});
                }
            }); 
            mongoclient.close();
        })
    })
}

module.exports = function(){
    return UsuariosDAO;
}