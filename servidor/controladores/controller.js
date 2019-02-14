var con = require("../lib/conexionbd.js");

function armarConsulta(req) {
  var sql = " from pelicula";
  var hayFiltro = false;

  if (req.query.titulo || req.query.anio || req.query.genero) {
    sql = sql.concat(" where ");
  }

  if (req.query.titulo) {
    sql = sql.concat(" titulo like % " + req.query.titulo + "%");
    var hayFiltro = true;
  }
  if (req.query.genero) {
    if (hayFiltro) {
      sql = sql.concat(" and ");
    }
    sql = sql.concat(" genero_id = " + req.query.genero);
    var hayFiltro = true;
  }
  if (req.query.anio) {
    if (hayFiltro) {
      sql = sql.concat(" and ");
    }
    sql = sql.concat(" anio = " + req.query.anio);
    var hayFiltro = true;
  }
  if (req.query.tipo_orden) {
    sql = sql.concat(
      " order by " + req.query.columna_orden + " " + req.query.tipo_orden
    );
    var hayFiltro = true;
  }
  if (req.query.cantidad) {
    sql = sql.concat(" limit 0," + req.query.cantidad);
    var hayFiltro = true;
  }
  sql = sql.concat(";");
  return sql;
}

function devolverTodas(req, res) {
  var query = armarConsulta(req);
  var sql = "select *".concat(query);
  var count = "select count(id) as total".concat(query);
  con.query(sql, function(error, resultado) {
    con.query(count, function(errorCount, resultadoCount) {
      var response = {
        peliculas: resultado,
        total: resultadoCount[0].total
      };

      res.send(JSON.stringify(response));
    });
  });
}

function devolverGeneros(req, res) {
  var sql = "select * from genero";
  con.query(sql, function(error, resultado) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    var response = {
      generos: resultado
    };

    res.send(JSON.stringify(response));
  });
}

function peliculaPorId(id, res) {
  var sql =
    "SELECT * FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor ON actor_pelicula.actor_id = actor.id where pelicula.id=" +
    id +
    ";";
  con.query(sql, function(error, resultado) {
    var generoSql =
      "SELECT * FROM genero where id=" + resultado[0].genero_id + ";";
    con.query(generoSql, function(error, resultadoGenero) {
      var actores = [];
      var pelicula = {
        titulo: resultado[0].titulo,
        duracion: resultado[0].duracion,
        director: resultado[0].director,
        poster: resultado[0].poster,
        anio: resultado[0].anio,
        fecha_lanzamiento: resultado[0].fecha_lanzamiento,
        trama: resultado[0].trama,
        puntuacion: resultado[0].puntuacion,
        nombre: resultadoGenero[0].nombre
      };
      resultado.forEach(element => {
        actores.push(element);
      });
      var respuesta = {
        pelicula: pelicula,
        actores: actores
      };
      res.send(respuesta);
    });
  });
}

module.exports = {
  devolverTodas: devolverTodas,
  devolverGeneros: devolverGeneros,
  peliculaPorId: peliculaPorId
};
