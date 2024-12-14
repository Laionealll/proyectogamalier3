import { db } from './connection';

export function initializeSchema(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS profesores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario TEXT UNIQUE NOT NULL,
          contrasena TEXT NOT NULL,
          es_admin INTEGER DEFAULT 0
        )
      `)
      .run(`
        CREATE TABLE IF NOT EXISTS materias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL
        )
      `)
      .run(`
        CREATE TABLE IF NOT EXISTS profesor_materias (
          profesor_id INTEGER,
          materia_id INTEGER,
          FOREIGN KEY (profesor_id) REFERENCES profesores(id),
          FOREIGN KEY (materia_id) REFERENCES materias(id),
          PRIMARY KEY (profesor_id, materia_id)
        )
      `)
      .run(`
        CREATE TABLE IF NOT EXISTS estudiantes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          curso TEXT NOT NULL,
          seccion TEXT NOT NULL
        )
      `)
      .run(`
        CREATE TABLE IF NOT EXISTS calificaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          estudiante_id INTEGER,
          materia_id INTEGER,
          periodo INTEGER NOT NULL,
          subnota1 REAL,
          subnota2 REAL,
          subnota3 REAL,
          subnota4 REAL,
          promedio REAL,
          FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
          FOREIGN KEY (materia_id) REFERENCES materias(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}