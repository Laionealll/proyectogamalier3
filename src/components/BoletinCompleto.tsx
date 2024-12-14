import React from 'react';
import { Estudiante } from '../types/types';
import { getAllCalificaciones } from '../services/calificacionService';
import { useEffect, useState } from 'react';

interface BoletinCompletoProps {
  estudiante: Estudiante;
}

export const BoletinCompleto: React.FC<BoletinCompletoProps> = ({ estudiante }) => {
  const [calificaciones, setCalificaciones] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCalificaciones = async () => {
      try {
        const data = await getAllCalificaciones(estudiante.id);
        setCalificaciones(data);
      } catch (error) {
        console.error('Error al cargar calificaciones:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarCalificaciones();
  }, [estudiante.id]);

  const calcularPromedioPeriodo = (subNotas: (number | null)[]) => {
    const notasValidas = subNotas.filter((nota): nota is number => nota !== null);
    if (notasValidas.length === 0) return null;
    const suma = notasValidas.reduce((a, b) => a + b, 0);
    return suma / notasValidas.length;
  };

  const calcularPromedioFinal = (calificacionesMateria: any) => {
    if (!calificacionesMateria) return null;
    const promedios = Object.values(calificacionesMateria).map((cal: any) => 
      calcularPromedioPeriodo(cal.subNotas)
    );
    const promediosValidos = promedios.filter((p): p is number => p !== null);
    if (promediosValidos.length === 0) return null;
    return promediosValidos.reduce((a, b) => a + b, 0) / promediosValidos.length;
  };

  const handleImprimir = () => {
    window.print();
  };

  if (cargando) {
    return <div className="text-center p-6">Cargando calificaciones...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Boletín de Calificaciones</h2>
          <p className="text-gray-600">
            {estudiante.nombre} {estudiante.apellido}
          </p>
          <p className="text-gray-600">
            {estudiante.curso} - Sección {estudiante.seccion}
          </p>
        </div>
        <button
          onClick={handleImprimir}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Imprimir Boletín
        </button>
      </div>

      <div className="space-y-6">
        {calificaciones && Object.entries(calificaciones).map(([materia, calificacionesMateria]: [string, any]) => {
          const promedioFinal = calcularPromedioFinal(calificacionesMateria);

          return (
            <div key={materia} className="border rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">{materia}</h3>
              {Object.keys(calificacionesMateria).length > 0 ? (
                <div>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {Object.entries(calificacionesMateria).map(([periodo, cal]: [string, any]) => (
                      <div key={periodo} className="text-center">
                        <h4 className="font-medium">Periodo {periodo}</h4>
                        <p className="text-lg">
                          {calcularPromedioPeriodo(cal.subNotas)?.toFixed(2) ?? 'Pendiente'}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-right font-bold">
                    Promedio Final: {promedioFinal?.toFixed(2) ?? 'Pendiente'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay calificaciones registradas</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};