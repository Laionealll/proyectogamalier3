import React, { useState } from 'react';
import { Login } from './components/Login';
import { ConsultaNotas } from './components/ConsultaNotas';
import { Profesor } from './types/types';

function App() {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [profesorActual, setProfesorActual] = useState<Profesor | null>(null);

  const handleLogin = (usuarioId: string, profesor: Profesor) => {
    setUsuario(usuarioId);
    setProfesorActual(profesor);
  };

  if (!usuario || !profesorActual) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Sistema de Calificaciones</h1>
            <p className="text-gray-600">
              {profesorActual.esAdmin 
                ? "Administrador - Todas las materias" 
                : `Profesor - ${profesorActual.materias.join(", ")}`}
            </p>
          </div>
          <button
            onClick={() => {
              setUsuario(null);
              setProfesorActual(null);
            }}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-6">
        <ConsultaNotas profesorActual={profesorActual} />
      </main>
    </div>
  );
}

export default App;