import { Estudiante, Calificacion, Materias, Profesor } from '../types/types';

// base de datos de estudiantes
const initialEstudiantes: Estudiante[] = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez', curso: '5to', seccion: 'A' },
  { id: '2', nombre: 'María', apellido: 'García', curso: '5to', seccion: 'A' },
  { id: '3', nombre: 'Andres', apellido: 'Escolastico', curso: '6to', seccion: 'B' },
  { id: '4', nombre: 'Carlos', apellido: 'Rodríguez', curso: '6to', seccion: 'B' },
  { id: '5', nombre: 'Ana', apellido: 'Martínez', curso: '6to', seccion: 'C' },
  { id: '6', nombre: 'Laioneall', apellido: 'Williams', curso: '4to', seccion: 'A' },
  { id: '7', nombre: 'Jose', apellido: 'Eduardo', curso: '4to', seccion: 'B' },
  { id: '8', nombre: 'Waner', apellido: 'Eduardo', curso: '4to', seccion: 'C' },
];

// cargar estudiantes del local storage
export let estudiantes: Estudiante[] = JSON.parse(
  localStorage.getItem('estudiantes') || JSON.stringify(initialEstudiantes)
);

// cargar calificaciones del local storage
const calificacionesEstudiantes: Record<string, Record<Materias, Record<number, Calificacion>>> = JSON.parse(
  localStorage.getItem('calificaciones') || '{}'
);

// materias disponibles
export const materias: Materias[] = [
  "Matemáticas",
  "Ciencias Sociales",
  "Ciencias Naturales",
  "Lengua Española"
];

// base de datos de profesores
export const profesores: Profesor[] = [
  { 
    usuario: 'waner', 
    contrasena: '123456', 
    materias: ["Matemáticas"],
    esAdmin: false
  },
  { 
    usuario: 'profesor2', 
    contrasena: '123456', 
    materias: ["Ciencias Sociales"],
    esAdmin: false
  },
  { 
    usuario: 'admin', 
    contrasena: 'admin', 
    materias: materias,
    esAdmin: true
  },
  { 
    usuario: 'profesor3', 
    contrasena: '12345', 
    materias: ["Ciencias Naturales","Ciencias Sociales",],
    esAdmin: true
  }
];

// funcion para agregar un nuevo estudiantee
export const agregarEstudiante = (estudiante: Estudiante) => {
  estudiantes = [...estudiantes, estudiante];
  localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
};

// funcion para guardar las calificaciones
export const guardarCalificaciones = (
  estudianteId: string,
  materia: Materias,
  calificaciones: Record<number, Calificacion>
) => {
  if (!calificacionesEstudiantes[estudianteId]) {
    calificacionesEstudiantes[estudianteId] = {} as Record<Materias, Record<number, Calificacion>>;
  }
  calificacionesEstudiantes[estudianteId][materia] = calificaciones;
  localStorage.setItem('calificaciones', JSON.stringify(calificacionesEstudiantes));
};

// Ffuncion para tener calificaciones de una materia y estudiante en especifico
export const obtenerCalificaciones = (estudianteId: string, materia: Materias) => {
  return calificacionesEstudiantes[estudianteId]?.[materia];
};

// funcion para tener todas las calificaciones del estudiante
export const obtenerTodasLasCalificaciones = (estudianteId: string) => {
  return calificacionesEstudiantes[estudianteId];
};

// funcion para eliminar todo
export const clearData = () => {
  localStorage.removeItem('estudiantes');
  localStorage.removeItem('calificaciones');
  estudiantes = [...initialEstudiantes];
  Object.keys(calificacionesEstudiantes).forEach(key => {
    delete calificacionesEstudiantes[key];
  });
};