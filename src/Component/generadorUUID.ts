import { v4 as uuidv4 } from 'uuid';

// Función que genera un UUID
export const generarUUID = (): string => {
  return uuidv4();
};
