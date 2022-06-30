const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

const Usuario = require("../models/usuario");

const usuariosGet = async(req = request, res = response) => {
  
  const {limit = 5, skip = 0} = req.query;

    // Hay que esperar el tiempo de la primer peticion para
    // hacer la segunda (demora mas tiempo)
  /* const usuarios = await Usuario.find({estado: true})
    .skip(Number(skip))
    .limit(Number(limit))

  const total = await Usuario.countDocuments({estado: true}) */

  // Hacer ambas peticiones al mismo tiempo (demora menos tiempo)
  const [total, usuarios] = await Promise.all([ // Desestructuracion de array por posicion
    Usuario.countDocuments({estado: true}),
    Usuario.find({estado: true})
      .skip(Number(skip))
      .limit(Number(limit))
  ])

  res.json({
    total_usuarios: total,
    usuarios
  });
};

const usuariosPut = async(req, res = response) => {
  const id = req.params.id;
  const { password, google, correo, ...rest } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, rest)

  res.json({
    usuario
  });
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosDelete = async(req = request, res = response) => {
  
  const {id} = req.params;

  const uid = req.uid

  // Eliminar literlamente de la DB
  /* const usuario = await Usuario.findByIdAndDelete(id) */

  // Cambiar estado a false para que no se elimine literalmente
  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
  
  res.json({
    'Usuario eliminado': usuario
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
};
