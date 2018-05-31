module.exports.index = function(application, req, res){
        res.render('index', {validacao: {}});
}

module.exports.autenticar = function(application, req, res){

        const dadosForm = req.body;

        req.assert('usuario', 'Usuário vazio').notEmpty();
        req.assert('senha', 'Senha vazia').notEmpty();

        const erros = req.validationErrors();

        if(erros){
          return res.render('index', {validacao: erros});
        }

        const connection = application.config.dbConnection;
        const UsuariosDAO = new application.app.models.UsuariosDAO(connection);

        UsuariosDAO.autenticar(dadosForm, req, res);

}