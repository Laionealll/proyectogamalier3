export interface Profesor {
  usuario: string;
  contrasena: string;
  materias: Materias[];
  esAdmin?: boolean;
}

export interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  curso: string;
  seccion: string;
}

export interface Calificacion {
  periodoId: number;
  subNotas: (number | null)[];
  notaFinal?: number;
}

export interface CalificacionMateria {
  materiaId: Materias;
  calificaciones: Record<number, Calificacion>;
  promedioFinal?: number;
}

export type Materias = "Matemáticas" | "Ciencias Sociales" | "Ciencias Naturales" | "Lengua Española";
export type Cursos = "4to" | "5to" | "6to";
export type Secciones = "A" | "B" | "C";