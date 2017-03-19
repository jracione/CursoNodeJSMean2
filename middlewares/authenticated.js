// midleware para validar la sesión del usuario
//se utilizará en la llamada a cualquier método para validar el usuario

'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');

// Clave que usaremos para cifrar el token
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
    }

    // si el token existe, sustituir las " y ' por nada
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token,secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'El token ha expirado. Volver a autenticarse'});
          }

    } catch(ex){
        console.log(ex);
        return res.status(404).send({message: 'Token no válido'});
        }

        // Si la autenticacion es correcta, devolvemos los datos del usuario que contiene el token
        req.user = payload;
        //console.log(req);
        next();
};
