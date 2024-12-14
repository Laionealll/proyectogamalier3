import React from 'react';
import { Materias, Cursos, Secciones } from '../types/types';

interface SeleccionCursoProps {
  onSeleccion: (materia: Materias, curso: Cursos, seccion: Secciones) => void;
}

export const SeleccionCurso: React.FC<SeleccionCursoProps> = ({ onSeleccion }) => {
  const [materia, setMateria] = React.useState<Materias>("Matemáticas");
  const [curso, setCurso] = React.useState<Cursos>("4to");
  const [seccion, setSeccion] = React.useState<Secciones>("A");

  const materias: Materias[] = ["Matemáticas", "Ciencias Sociales", "Ciencias Naturales", "Lengua Española"];
  const cursos: Cursos[] = ["4to", "5to", "6to"];
  const secciones: Secciones[] = ["A", "B", "C"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSeleccion(materia, curso, seccion);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Selección de Curso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Materia</label>
          <select
            value={materia}
            onChange={(e) => setMateria(e.target.value as Materias)}
            className="w-full p-2 border rounded-md"
          >
            {materias.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Curso</label>
          <select
            value={curso}
            onChange={(e) => setCurso(e.target.value as Cursos)}
            className="w-full p-2 border rounded-md"
          >
            {cursos.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Sección</label>
          <select
            value={seccion}
            onChange={(e) => setSeccion(e.target.value as Secciones)}
            className="w-full p-2 border rounded-md"
          >
            {secciones.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Continuar
        </button>
      </form>
    </div>
  );
};