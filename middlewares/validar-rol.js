const {request, response} = require('express');

const validarRol = (req = request, res = response, next) => {
    
    const {rol} = req.usuario;
    if(rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'No tienes permiso de administrador'
        })
    }

    next();
}

module.exports = {
    validarRol
}