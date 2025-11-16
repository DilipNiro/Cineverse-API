export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  error.statusCode = status; // Ajouter statusCode pour compatibilité
  return error;
};

