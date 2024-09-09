import { v4 as uuidv4 } from 'uuid';

// Función que genera un UUID sin guiones
export const generarUUID = (): string => {
  const uuidSinGuiones = uuidv4().replace(/-/g, '');  // Elimina los guiones del UUID
  console.log(`UUID generado sin guiones: ${uuidSinGuiones}`);  // Agregar log para depuración
  return uuidSinGuiones;
};
