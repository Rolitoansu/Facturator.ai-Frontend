// Este archivo es el punto de entrada original de $lib/api
// Ahora re-exporta todo desde el directorio modular lib/api/
// Mantiene compatibilidad total con todos los imports existentes: from '$lib/api'
export * from './api/index';
