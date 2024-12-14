import React, { useState } from 'react';
import { Estudiante } from '../types/types';
import { RegistroNotas } from './RegistroNotas';
import { AgregarEstudiante } from './AgregarEstudiante';
import { agregarEstudiante } from '../data/mockData';

interface ListaEstudiantesProps {
  estudiantes: Estudiante[];
  curso: string;
  seccion: string;
}

export const ListaEstudiantes: React.FC<ListaEstudiantesProps> = ({
  estudiantes,
  curso,
  seccion,
}) => {
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const estudiantesFiltrados = estudiantes.filter(
    (e) => 
      e.curso === curso && 
      e.seccion === seccion &&
      (busqueda === '' || 
       e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
       e.apellido.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleAgregarEstudiante = (nuevoEstudiante: Estudiante) => {
    agregarEstudiante(nuevoEstudiante);
    setMostrarFormulario(false);
  };

  if (mostrarFormulario) {
    return (
      <AgregarEstudiante
        onAgregar={handleAgregarEstudiante}
        onCancel={() => setMostrarFormulario(false)}
        cursoActual={curso}
        seccionActual={seccion}
      />
    );
  }

  if (estudianteSeleccionado) {
    return (
      <div className="container mx-auto px-4">
        <button
          onClick={() => setEstudianteSeleccionado(null)}
          className="mb-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        >
          Volver a la lista
        </button>
        <RegistroNotas estudiante={estudianteSeleccionado} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar estudiante..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 p-2 border rounded-md"
        />
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Agregar Estudiante
        </button>
      </div>

      <div className="grid gap-4">
        {estudiantesFiltrados.map((estudiante) => (
          <div
            key={estudiante.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">
                {estudiante.nombre} {estudiante.apellido}
              </h3>
              <p className="text-gray-600">
                {estudiante.curso} - Sección {estudiante.seccion}
              </p>
            </div>
            <button
              onClick={() => setEstudianteSeleccionado(estudiante)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Ver/Editar Notas
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};