const {request, response, json} = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req = request, res  = response) => {

    const {correo, password} = req.body

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo})
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - correo'
            });
        }

        // Si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - estado:false'
            });
        }

        // Verificar la contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async(req = request, res = response, next) => {

    const {id_token} = req.body;

    try {
        
        const googleUser = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo: googleUser.email});

        if(!usuario) {
            const data = {
                nombre: googleUser.name,
                correo: googleUser.email,
                password: ':P',
                img: googleUser.picture,
                google: true,
                rol: 'ADMIN_ROLE'
            }

            usuario = new Usuario(data)
            await usuario.save();
        }

        if(!usuario.estado) {
            return res.status(401).json({
                msg:' Usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}