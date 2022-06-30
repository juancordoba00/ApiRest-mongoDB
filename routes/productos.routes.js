const {Router} = require('express');
const {check} = require('express-validator');
const { 
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos.controller');
const { existeCateogria, existeProducto } = require('../helpers/db-validators');
const { validarJWT, validarRol } = require('../middlewares');

const {validarCampos} = require('../middlewares/validar-campos');

const router = Router();

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProductoId)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCateogria),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    validarRol,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto)

module.exports = router;