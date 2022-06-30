const { request, response } = require("express")
const Categoria = require('../models/categoria')


// Obtener categorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {
    const {limit = 5, skip = 0} = req.query;

    const [total, cateogorias] = await Promise.all([
        Categoria.countDocuments({estado: true}),
        Categoria.find({estado: true})
            .populate('usuario', 'nombre')
            .skip(Number(skip))
            .limit(Number(limit))
    ])

    res.json({
        total_categorias: total,
        cateogorias
    });
}

const ObtenerCategoriaId = async(req = request, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria)
}

const crearCategoria = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    await categoria.save()

    res.status(201).json(categoria)

}

const actualizarCategoria = async(req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria)
}

const borrarCategoria = async(req, res = response) => {
    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(categoriaBorrada)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    ObtenerCategoriaId,
    actualizarCategoria,
    borrarCategoria
}