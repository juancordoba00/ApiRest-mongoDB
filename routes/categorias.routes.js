const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, obtenerCategorias, ObtenerCategoriaId, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCateogria } = require('../helpers/db-validators');
const { validarJWT, validarRol } = require('../middlewares');

const {validarCampos} = require('../middlewares/validar-campos');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCateogria),
    validarCampos
], ObtenerCategoriaId)

// Crear categoria - privado
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar un registro - privado
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCateogria),
    validarCampos
], actualizarCategoria)

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    validarRol,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCateogria),
    validarCampos
], borrarCategoria)

module.exports = router;