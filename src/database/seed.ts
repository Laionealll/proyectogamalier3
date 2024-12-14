import { db } from './connection';

export function seedDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // validar que existe 
      db.get('SELECT COUNT(*) as count FROM materias', [], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          const materias = [
            'Matemáticas',
            'Ciencias Sociales',
            'Ciencias Naturales',
            'Lengua Española'
          ];

          const stmt = db.prepare('INSERT INTO materias (nombre) VALUES (?)');
          materias.forEach(materia => {
            stmt.run(materia);
          });
          stmt.finalize();
        }
      });

      db.get('SELECT COUNT(*) as count FROM profesores', [], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          const profesores = [
            { usuario: 'profesor1', contrasena: '123456', es_admin: 0 },
            { usuario: 'profesor2', contrasena: '123456', es_admin: 0 },
            { usuario: 'admin', contrasena: 'admin123', es_admin: 1 }
          ];

          const stmt = db.prepare('INSERT INTO profesores (usuario, contrasena, es_admin) VALUES (?, ?, ?)');
          profesores.forEach(profesor => {
            stmt.run(profesor.usuario, profesor.contrasena, profesor.es_admin);
          });
          stmt.finalize();

          // asignacion de materias a profesores despues de que fueron creados
          db.serialize(() => {
            db.all('SELECT id, usuario FROM profesores', [], (err, profesores: any[]) => {
              if (err) {
                reject(err);
                return;
              }

              db.all('SELECT id, nombre FROM materias', [], (err, materias: any[]) => {
                if (err) {
                  reject(err);
                  return;
                }

                const stmt = db.prepare('INSERT INTO profesor_materias (profesor_id, materia_id) VALUES (?, ?)');

                profesores.forEach(profesor => {
                  if (profesor.usuario === 'admin') {
                    materias.forEach(materia => {
                      stmt.run(profesor.id, materia.id);
                    });
                  } else if (profesor.usuario === 'profesor1') {
                    const matematicas = materias.find(m => m.nombre === 'Matemáticas');
                    if (matematicas) {
                      stmt.run(profesor.id, matematicas.id);
                    }
                  } else if (profesor.usuario === 'profesor2') {
                    const cienciasSociales = materias.find(m => m.nombre === 'Ciencias Sociales');
                    if (cienciasSociales) {
                      stmt.run(profesor.id, cienciasSociales.id);
                    }
                  }
                });

                stmt.finalize();
                resolve();
              });
            });
          });
        } else {
          resolve();
        }
      });
    });
  });
}