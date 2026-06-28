const requiredEnvVars: string[] = [
  // Variables are optional in development/local mode since defaults or SQLite fallbacks are provided.
];

export const validateEnv = () => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`[Environment Warning] Missing optional environment variables: ${missingVars.join(', ')}`);
  } else {
    console.log('[Environment] Optional environment variables check passed.');
  }
};
