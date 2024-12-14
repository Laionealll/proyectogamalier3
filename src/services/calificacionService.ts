import { Calificacion, Materias } from '../types/types';
import { obtenerCalificaciones, guardarCalificaciones as saveCalificaciones, obtenerTodasLasCalificaciones } from '../data/mockData';

export function getCalificaciones(estudianteId: string, materia: Materias): Promise<Record<number, Calificacion> | undefined> {
  return Promise.resolve(obtenerCalificaciones(estudianteId, materia));
}

export function guardarCalificaciones(
  estudianteId: string,
  materia: Materias,
  calificaciones: Record<number, Calificacion>
): Promise<boolean> {
  try {
    saveCalificaciones(estudianteId, materia, calificaciones);
    return Promise.resolve(true);
  } catch (error) {
    console.error('Error al guardar calificaciones:', error);
    return Promise.reject(error);
  }
}

export function getAllCalificaciones(estudianteId: string): Promise<Record<string, Record<number, Calificacion>>> {
  return Promise.resolve(obtenerTodasLasCalificaciones(estudianteId) || {});
}