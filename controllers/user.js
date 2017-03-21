'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt')

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios del api rest con Node y Mongo'
    });
}

function saveUser(req, res){
    // inicializamos el objeto usuario
    var user = new User();

    //recogemos los parámetros que nos vienen en el body de la petición
    var params = req.body;

    console.log(params);

    // Asignamos cada parámetro al la propiedad del objeto usuario correspondiente
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    // guardamos en DDBB

    if(params.password){
      //encriptar contraseña y guardar datos
      bcrypt.hash(params.password, null, null, function(err, hash){
          user.password = hash;
          if(user.name !=null && user.surname != null && user.email != null){
            // Guardar el usuario en DDBB
            user.save((err, userStored) => {
                if(err){
                    res.status(500).send({message: 'Error al guardar el usuario en DDBB'});
                } else {
                    if (!userStored){
                          res.status(404).send({message: 'No se ha registrado el usuario'});
                      } else {
                          res.status(200).send({user: userStored});
                      }
                    }
            })
          } else {
            res.status(200).send({message: 'Rellenar todos los datos del usuario'});
          }
      });
    } else {
        res.status(200).send({message: 'Introducir la contraseña'});
    }
}

function loginUser(req, res){
    // Función para el login de usuarios
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: "Error en la petición"});
        } else {
            if(!user){
                // Si el usuario no existe, mostrar el error correspondiente
                res.status(404).send({message: "El usuario no existe"});
            } else {
                // Comprobar la contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //Devolver los datos del usuario logueado
                        if(params.gethash){
                            // Devolver token del objeto del usuario con jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })

                        } else {

                            // Si no hay propiedad gethash
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: "El usuario no pudo loguearse"});
                    }
                });
            }

        }
    })


}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        } else {
            if(!userUpdated){
                res.status(404).send({message: 'Error al actualizar el usuario. El usuario no existe.'});
            } else {
                res.status(200).send({user: userUpdated})
            }

        }
    });


};

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido...'; //Nombre del fichero a subir

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2]; // extraigo el nombre

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1]; // extraigo la extensión

        console.log(file_path);
        console.log(file_split);
        console.log(file_name);
    } else {
        res.status(200).send({message: 'No se ha subido ninguna imagen.'});
    }

}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage
};
