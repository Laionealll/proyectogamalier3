import { Profesor } from '../types/types';
import { profesores } from '../data/mockData';

export function getProfesor(usuario: string, contrasena: string): Promise<Profesor | null> {
  const profesor = profesores.find(
    p => p.usuario === usuario && p.contrasena === contrasena
  );
  return Promise.resolve(profesor || null);
}