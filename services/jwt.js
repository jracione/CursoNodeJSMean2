// Servicios de jwt
'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');

// Clave que usaremos para cifrar el token
var secret = 'clave_secreta_curso';

// método para crear un token con los datos que queremos incluir del usuario
// mas la fecha de creación mas la fecha de expiración
exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    // generamos un token cifrado con los datos de lusuario y usando la Clave
    return jwt.encode(payload, secret);
};
