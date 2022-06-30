const { Router } = require("express");
const { check } = require("express-validator");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
} = require('../controllers/users.controller');

const { esRolValido, existeEmail, existeUsuarioPorId } = require("../helpers/db-validators");

const {
    validarCampos,
    validarJWT,
    validarRol
} = require('../middlewares');

const router = Router();

router.get("/", usuariosGet);

router.put("/:id", [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post("/", [
    check('correo', 'El correo no es válido').isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener minimo 6 letras').isLength({min: 6}),
    /* check('rol', 'No es un rol válido').isIn(['ADMIN_ROEL', 'USER_ROLE']), */
    check('rol').custom(esRolValido), // Es lo mismo ((rol) => esRolValido(rol))
    check('correo').custom(existeEmail),
    validarCampos
], usuariosPost);

router.delete("/:id", [
    validarJWT,
    validarRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;
