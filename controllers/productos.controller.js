const { request, response } = require("express")
const Producto = require('../models/producto')


const obtenerProductos = async(req = request, res = response) => {
    const {limit = 5, skip = 0} = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado: true})
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(skip))
            .limit(Number(limit))
    ])

    res.json({
        total_productos: total,
        productos
    });
}

const obtenerProductoId = async(req = request, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id)
                        .populate('usuario', 'nombre')
                        .populate('categoria', 'nombre')

    res.json(producto)
}

const crearProducto = async(req = request, res = response) => {

    const {estado, usuario, ...body} = req.body

    const productoDB = await Producto.findOne({nombre: body.nombre})
    
    if(productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data)

    await producto.save()

    res.status(201).json(producto)

}

const actualizarProducto = async(req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto)
}

const borrarProducto = async(req, res = response) => {
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(productoBorrado)
}

module.exports = {
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    crearProducto,
    borrarProducto
}