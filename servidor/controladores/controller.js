var con = require("../lib/conexionbd.js");



function armarConsulta(req){
  var sql = " from pelicula";
  var hayFiltro = false;

  if(req.query.titulo || req.query.anio || req.query.genero){
    sql = sql.concat(" where ")
  }

  if(req.query.titulo){
    if(hayFiltro){
      sql = sql.concat(" and ")
    }
    sql=sql.concat(" titulo = " + req.query.titulo)
  }
   if(req.query.genero){
    if(hayFiltro){
      sql = sql.concat(" and ")
    }
    sql=sql.concat(" genero = " + req.query.genero)
  }
  if(req.query.aio){
    if(hayFiltro){
      sql = sql.concat(" and ")
    }
    sql=sql.concat(" anio = " + req.query.anio)
  }
  if(req.query.tipo_orden){
    sql = sql.concat(" order by " + req.query.columna_orden + " " + req.query.tipo_orden)
  }
  if(req.query.cantidad){
    sql=sql.concat(" limit 0," + req.query.cantidad)
  }
  sql= sql.concat("; ")
  return sql; 

}






function devolverTodas(req, res) {
  var sql = "select * from pelicula";
  con.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    var response = {
      peliculas: resultado
    };

    res.send(JSON.stringify(response));
  });
}

function devolverGeneros(req, res) {
  var sql = "select * from genero";
  con.query(sql, function(error, resultado, fields) {
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
module.exports = {
  devolverTodas: devolverTodas,
  devolverGeneros: devolverGeneros
};
