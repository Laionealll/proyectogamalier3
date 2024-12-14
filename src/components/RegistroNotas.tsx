import React, { useState, useEffect } from 'react';
import { Estudiante, Calificacion, Materias } from '../types/types';
import { guardarCalificaciones, getCalificaciones } from '../services/calificacionService';
import { TablaNotas } from './TablaNotas';
import { BoletinCompleto } from './BoletinCompleto';

interface RegistroNotasProps {
  estudiante: Estudiante;
  materiaActual: Materias;
  materiasPermitidas: Materias[];
}

export const RegistroNotas: React.FC<RegistroNotasProps> = ({ 
  estudiante, 
  materiaActual,
  materiasPermitidas 
}) => {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<Materias>(materiaActual);
  const [calificaciones, setCalificaciones] = useState<Record<number, Calificacion>>({
    1: { periodoId: 1, subNotas: [null, null, null, null] },
    2: { periodoId: 2, subNotas: [null, null, null, null] },
    3: { periodoId: 3, subNotas: [null, null, null, null] },
    4: { periodoId: 4, subNotas: [null, null, null, null] },
  });
  const [mensaje, setMensaje] = useState('');
  const [mostrarBoletin, setMostrarBoletin] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarCalificaciones = async () => {
      try {
        const calificacionesGuardadas = await getCalificaciones(estudiante.id, materiaSeleccionada);
        if (calificacionesGuardadas) {
          setCalificaciones(calificacionesGuardadas);
        } else {
          setCalificaciones({
            1: { periodoId: 1, subNotas: [null, null, null, null] },
            2: { periodoId: 2, subNotas: [null, null, null, null] },
            3: { periodoId: 3, subNotas: [null, null, null, null] },
            4: { periodoId: 4, subNotas: [null, null, null, null] },
          });
        }
      } catch (error) {
        setMensaje('Error al cargar las calificaciones');
        console.error(error);
      }
    };

    cargarCalificaciones();
  }, [estudiante.id, materiaSeleccionada]);

  const calcularPromedioPeriodo = (subNotas: (number | null)[]) => {
    const notasValidas = subNotas.filter((nota): nota is number => nota !== null);
    if (notasValidas.length === 0) return null;
    const suma = notasValidas.reduce((a, b) => a + b, 0);
    return suma / notasValidas.length;
  };

  const calcularPromedioFinal = () => {
    const promedios = Object.values(calificaciones).map(cal => 
      calcularPromedioPeriodo(cal.subNotas)
    );
    const promediosValidos = promedios.filter((p): p is number => p !== null);
    if (promediosValidos.length === 0) return null;
    return promediosValidos.reduce((a, b) => a + b, 0) / promediosValidos.length;
  };

  const handleNotaChange = (periodo: number, subIndex: number, valor: string) => {
    const numeroValor = valor === '' ? null : Number(valor);
    
    if (numeroValor !== null && (numeroValor < 0 || numeroValor > 100)) {
      setMensaje('Las notas deben estar entre 0 y 100');
      return;
    }
    
    setMensaje('');
    setCalificaciones(prev => ({
      ...prev,
      [periodo]: {
        ...prev[periodo],
        subNotas: prev[periodo].subNotas.map((nota, i) => 
          i === subIndex ? numeroValor : nota
        ),
      },
    }));
  };

  const validarCalificaciones = () => {
    let todasCompletas = true;
    let algunaNota = false;

    for (const periodo of Object.values(calificaciones)) {
      const notasDelPeriodo = periodo.subNotas.filter(nota => nota !== null);
      if (notasDelPeriodo.length > 0) {
        algunaNota = true;
        if (notasDelPeriodo.length < 4) {
          todasCompletas = false;
          break;
        }
      }
    }

    if (!algunaNota) return true; // Permitir guardar si no hay notas
    return todasCompletas;
  };

  const handleGuardar = async () => {
    if (!validarCalificaciones()) {
      setMensaje('Debe completar todas las notas del periodo una vez que comience a calificar');
      return;
    }

    setGuardando(true);
    setMensaje('');
    
    try {
      await guardarCalificaciones(estudiante.id, materiaSeleccionada, calificaciones);
      setMensaje('Calificaciones guardadas exitosamente');
    } catch (error) {
      setMensaje('Error al guardar las calificaciones');
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarMateria = async (nuevaMateria: Materias) => {
    setMateriaSeleccionada(nuevaMateria);
  };

  if (mostrarBoletin) {
    return (
      <div>
        <button
          onClick={() => setMostrarBoletin(false)}
          className="mb-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        >
          Volver al registro de notas
        </button>
        <BoletinCompleto estudiante={estudiante} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Calificaciones de {materiaSeleccionada}
          </h2>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cambiar Materia
            </label>
            <select
              value={materiaSeleccionada}
              onChange={(e) => handleCambiarMateria(e.target.value as Materias)}
              className="w-64 p-2 border rounded-md"
            >
              {materiasPermitidas.map(materia => (
                <option key={materia} value={materia}>{materia}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setMostrarBoletin(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Ver Boletín Completo
        </button>
      </div>
      
      {mensaje && (
        <div className={`p-4 mb-4 rounded-md ${
          mensaje.includes('error') || mensaje.includes('debe')
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {mensaje}
        </div>
      )}

      <TablaNotas
        calificaciones={calificaciones}
        onNotaChange={handleNotaChange}
        calcularPromedioPeriodo={calcularPromedioPeriodo}
      />

      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-bold">
          Promedio Final: {calcularPromedioFinal()?.toFixed(2) ?? 'Pendiente'}
        </h3>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded-md ${
            guardando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {guardando ? 'Guardando...' : 'Guardar Calificaciones'}
        </button>
      </div>
    </div>
  );
};