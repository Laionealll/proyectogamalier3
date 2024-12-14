import React from 'react';
import { Calificacion } from '../types/types';

interface TablaNotasProps {
  calificaciones: Record<number, Calificacion>;
  onNotaChange: (periodo: number, subIndex: number, valor: string) => void;
  calcularPromedioPeriodo: (subNotas: (number | null)[]) => number | null;
}

export const TablaNotas: React.FC<TablaNotasProps> = ({
  calificaciones,
  onNotaChange,
  calcularPromedioPeriodo,
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(calificaciones).map(([periodo, calificacion]) => (
        <div key={periodo} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Periodo {periodo}</h3>
          <div className="grid grid-cols-4 gap-4">
            {calificacion.subNotas.map((nota, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-1">
                  Nota {index + 1}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={nota === null ? '' : nota}
                  onChange={(e) => onNotaChange(Number(periodo), index, e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="0-100"
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-right font-medium">
            Promedio del periodo: {calcularPromedioPeriodo(calificacion.subNotas)?.toFixed(2) ?? 'Pendiente'}
          </p>
        </div>
      ))}
    </div>
  );
};