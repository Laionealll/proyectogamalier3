import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../database.sqlite');

export const db = new Database(dbPath);


db.pragma('foreign_keys = ON');

// aqui se crean las tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS profesores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    es_admin INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profesor_materias (
    profesor_id INTEGER,
    materia_id INTEGER,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id),
    FOREIGN KEY (materia_id) REFERENCES materias(id),
    PRIMARY KEY (profesor_id, materia_id)
  );

  CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    curso TEXT NOT NULL,
    seccion TEXT NOT NULL
  );

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
  );
`);

// aquio se inicializa con la data default
const materiaCount = db.prepare('SELECT COUNT(*) as count FROM materias').get().count;
if (materiaCount === 0) {
  const materias = [
    'Matemáticas',
    'Ciencias Sociales',
    'Ciencias Naturales',
    'Lengua Española'
  ];
  
  const insertMateria = db.prepare('INSERT INTO materias (nombre) VALUES (?)');
  materias.forEach(materia => insertMateria.run(materia));
}

const profesorCount = db.prepare('SELECT COUNT(*) as count FROM profesores').get().count;
if (profesorCount === 0) {
  const profesores = [
    { usuario: 'profesor1', contrasena: '123456', es_admin: 0 },
    { usuario: 'profesor2', contrasena: '123456', es_admin: 0 },
    { usuario: 'admin', contrasena: 'admin123', es_admin: 1 }
  ];
  
  const insertProfesor = db.prepare('INSERT INTO profesores (usuario, contrasena, es_admin) VALUES (?, ?, ?)');
  profesores.forEach(profesor => {
    insertProfesor.run(profesor.usuario, profesor.contrasena, profesor.es_admin);
  });

  // asignar materias a profesores
  const insertProfesorMateria = db.prepare('INSERT INTO profesor_materias (profesor_id, materia_id) VALUES (?, ?)');
  const getProfesorId = db.prepare('SELECT id FROM profesores WHERE usuario = ?');
  const getMateriaId = db.prepare('SELECT id FROM materias WHERE nombre = ?');

  // el usuario admin tiene todos las materias
  const adminId = getProfesorId.get('admin').id;
  materias.forEach(materia => {
    const materiaId = getMateriaId.get(materia).id;
    insertProfesorMateria.run(adminId, materiaId);
  });

  // profesor1 gets Matemáticas
  const profesor1Id = getProfesorId.get('profesor1').id;
  const matematicasId = getMateriaId.get('Matemáticas').id;
  insertProfesorMateria.run(profesor1Id, matematicasId);

  // profesor2 gets Ciencias Sociales
  const profesor2Id = getProfesorId.get('profesor2').id;
  const cienciasSocialesId = getMateriaId.get('Ciencias Sociales').id;
  insertProfesorMateria.run(profesor2Id, cienciasSocialesId);
}