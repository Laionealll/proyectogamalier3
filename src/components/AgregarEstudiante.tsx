import React, { useState } from 'react';
import { Estudiante, Cursos, Secciones } from '../types/types';

interface AgregarEstudianteProps {
  onAgregar: (estudiante: Estudiante) => void;
  onCancel: () => void;
  cursoActual: string;
  seccionActual: string;
}

export const AgregarEstudiante: React.FC<AgregarEstudianteProps> = ({
  onAgregar,
  onCancel,
  cursoActual,
  seccionActual,
}) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoEstudiante: Estudiante = {
      id: Date.now().toString(),
      nombre,
      apellido,
      curso: cursoActual,
      seccion: seccionActual,
    };
    onAgregar(nuevoEstudiante);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Estudiante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Apellido
          </label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};