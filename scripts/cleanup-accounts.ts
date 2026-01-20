/**
 * Script para anonimizar cuentas eliminadas que han pasado el período de gracia.
 *
 * Uso:
 *   bun run scripts/cleanup-accounts.ts
 *
 * O configurar como cron job:
 *   0 0 * * * cd /path/to/project && bun run scripts/cleanup-accounts.ts
 *
 * También puedes llamar al endpoint:
 *   curl -X POST https://tu-dominio.com/api/user/cleanup \
 *     -H "Authorization: Bearer $CRON_SECRET"
 */

import { UserService } from '../modules/user/services/user.service';

async function main() {
  console.log('🔄 Iniciando limpieza de cuentas expiradas...');
  console.log(`📅 Fecha: ${new Date().toISOString()}`);

  const userService = new UserService();
  const result = await userService.cleanupExpiredAccounts();

  if (result.anonymizedCount === 0) {
    console.log('✅ No hay cuentas para anonimizar');
  } else {
    console.log(`✅ ${result.anonymizedCount} cuenta(s) anonimizada(s)`);
    console.log('📋 IDs anonimizados:', result.anonymizedUserIds.join(', '));
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Error durante la limpieza:', error);
  process.exit(1);
});
