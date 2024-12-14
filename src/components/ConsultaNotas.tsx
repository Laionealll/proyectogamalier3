import React, { useState } from 'react';
import { Estudiante, Materias, Profesor } from '../types/types';
import { estudiantes, obtenerCalificaciones } from '../data/mockData';
import { RegistroNotas } from './RegistroNotas';

interface ConsultaNotasProps {
  profesorActual: Profesor;
}

export const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ profesorActual }) => {
  const [busqueda, setBusqueda] = useState('');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<Materias>(profesorActual.materias[0]);
  const [filtros, setFiltros] = useState({
    curso: '',
    seccion: '',
  });

  const estudiantesFiltrados = estudiantes.filter((e) => {
    const coincideTexto = 
      busqueda === '' ||
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.apellido.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCurso = filtros.curso === '' || e.curso === filtros.curso;
    const coincideSeccion = filtros.seccion === '' || e.seccion === filtros.seccion;

    return coincideTexto && coincideCurso && coincideSeccion;
  });

  const cursos = Array.from(new Set(estudiantes.map(e => e.curso))).sort();
  const secciones = Array.from(new Set(estudiantes.map(e => e.seccion))).sort();

  if (estudianteSeleccionado) {
    return (
      <div className="container mx-auto px-4">
        <button
          onClick={() => setEstudianteSeleccionado(null)}
          className="mb-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        >
          Volver a la búsqueda
        </button>
        <RegistroNotas 
          estudiante={estudianteSeleccionado} 
          materiaActual={materiaSeleccionada}
          materiasPermitidas={profesorActual.materias}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Consulta y Registro de Notas</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar estudiante
            </label>
            <input
              type="text"
              placeholder="Nombre o apellido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materia
            </label>
            <select
              value={materiaSeleccionada}
              onChange={(e) => setMateriaSeleccionada(e.target.value as Materias)}
              className="w-full p-3 border rounded-md shadow-sm"
            >
              {profesorActual.materias.map(materia => (
                <option key={materia} value={materia}>{materia}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curso
            </label>
            <select
              value={filtros.curso}
              onChange={(e) => setFiltros(prev => ({ ...prev, curso: e.target.value }))}
              className="w-full p-3 border rounded-md shadow-sm"
            >
              <option value="">Todos los cursos</option>
              {cursos.map(curso => (
                <option key={curso} value={curso}>{curso}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sección
            </label>
            <select
              value={filtros.seccion}
              onChange={(e) => setFiltros(prev => ({ ...prev, seccion: e.target.value }))}
              className="w-full p-3 border rounded-md shadow-sm"
            >
              <option value="">Todas las secciones</option>
              {secciones.map(seccion => (
                <option key={seccion} value={seccion}>{seccion}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {estudiantesFiltrados.map((estudiante) => {
          const calificaciones = obtenerCalificaciones(estudiante.id, materiaSeleccionada);
          const tieneNotas = calificaciones !== undefined;

          return (
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
                {tieneNotas && (
                  <p className="text-sm text-green-600 mt-1">
                    Calificaciones registradas
                  </p>
                )}
              </div>
              <button
                onClick={() => setEstudianteSeleccionado(estudiante)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Ver/Editar Notas
              </button>
            </div>
          );
        })}

        {estudiantesFiltrados.length === 0 && (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">No se encontraron estudiantes</p>
          </div>
        )}
      </div>
    </div>
  );
};