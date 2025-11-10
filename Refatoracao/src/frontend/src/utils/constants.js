/**
 * Refatoração 2: Replace Magic String with Symbolic Constant
 * * Centraliza todas as chaves de localStorage para evitar erros
 * de digitação e facilitar a manutenção.
 */
export const AUTH_KEYS = {
  ACCESS: "access",
  REFRESH: "refresh",
  USERNAME: "username",
  IS_STAFF: "is_staff",
  IS_SUPERUSER: "is_superuser",
  FOTO_PERFIL: "fotoPerfil"
};