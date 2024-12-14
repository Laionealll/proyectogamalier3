import { Estudiante } from '../types/types';
import { estudiantes, agregarEstudiante as addEstudiante } from '../data/mockData';

export function getEstudiantes(): Promise<Estudiante[]> {
  return Promise.resolve(estudiantes);
}

export function addEstudiante(estudiante: Omit<Estudiante, 'id'>): Promise<string> {
  const newId = (estudiantes.length + 1).toString();
  const newEstudiante = { ...estudiante, id: newId };
  addEstudiante(newEstudiante);
  return Promise.resolve(newId);
}