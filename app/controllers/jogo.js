module.exports.jogo = function(application, req, res){
    
    if(!req.session.autorizado){
        res.send("Usuário precisa fazer loguin !!!");
        return;
    }

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);
    const casa = req.session.casa; // tentar depois usar $promisse
     JogoDAO.iniciaJogo(res, req.session.usuario, casa, req.query.msg);
    
}

module.exports.sair = function(application, req, res){
        req.session.destroy(function(erro){
            res.render("index", {validacao:{}});
        })
}

module.exports.suditos = function(application, req ,res){

    if(!req.session.autorizado){
        res.send("Usuário precisa fazer loguin !!!");
        return;
    }
    res.render("aldeoes");
}

module.exports.pergaminhos = function(application, req ,res){

    if(!req.session.autorizado){
        res.send("Usuário precisa fazer loguin !!!");
        return;
    }

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    const usuario = req.session.usuario;

    JogoDAO.getAcoes(usuario, res);

}

module.exports.ordenar_acao_sudito = function(application, req, res){

    if(!req.session.autorizado){
        res.send("Usuário precisa fazer loguin !!!");
        return;
    }

    var dadosForm = req.body;

    req.assert('acao', 'Acao não pode ser vazia').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo?msg=Erro');
        return;
    }

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=Ok');

    
}

module.exports.revogar_acao = function (application, req, res){
    let url_query = req.query;
    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    const _id = url_query.id_acao;
    JogoDAO.revogarAcao(_id, res);
}