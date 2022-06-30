const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../DB/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT

    this.paths = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos'
    }

    this.conectarDB()

    this.middlewares();

    this.routes();
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    this.app.use(cors())

    this.app.use(express.json())

    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.usuarios, require('../routes/user.routes'));
    this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
    this.app.use(this.paths.productos, require('../routes/productos.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
