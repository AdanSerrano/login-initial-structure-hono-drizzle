/**
 * Rutas públicas accesibles sin autenticación
 * Estas rutas no requieren login
 */
export const publicRoutes = ["/", "/terms", "/privacy"];

/**
 * Rutas de autenticación
 * Si el usuario ya está logueado, será redirigido al DEFAULT_LOGIN_REDIRECT
 * Estas rutas son para usuarios NO autenticados
 */
export const authRoutes = [
  "/login",
  "/register",
  "/register-success",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/resend-verification",
  "/magic-link/verify",
  "/magic-link"
];

/**
 * Prefijo para rutas de API de autenticación
 * Estas rutas siempre son permitidas
 */
export const apiAuthPrefix = "/api";

/**
 * Ruta de redirección por defecto después del login
 */
export const DEFAULT_LOGIN_REDIRECT = "/";