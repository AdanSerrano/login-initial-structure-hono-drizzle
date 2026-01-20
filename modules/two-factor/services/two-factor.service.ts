import QRCode from 'qrcode';
import { TwoFactorRepository } from '../repository/two-factor.repository';
import { sendTwoFactorEmail, sendTwoFactorDisabledEmail } from '../emails/two-factor.emails';
import { generateSixDigitCode, TOKEN_EXPIRY } from '@/lib/tokens';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import { sessionsService } from '@/modules/sessions/services/sessions.service';
import { trustedDevicesService } from '@/modules/trusted-devices/services/trusted-devices.service';
import type { VerifyTwoFactorInput, VerifyTwoFactorLoginInput } from '../validations/schema/two-factor.schema';
import type { TwoFactorSetupResponse, TwoFactorEmailSetupResponse, TwoFactorLoginResponse, TwoFactorMethod, BackupCodesResponse } from '../types/two-factor.types';
import cryptoNode from 'crypto';

const APP_NAME = process.env.APP_NAME || 'Mi Aplicación';

export interface TwoFactorOptions {
  ipAddress?: string;
  userAgent?: string;
  trustDevice?: boolean;
}

export class TwoFactorService {
  private repository: TwoFactorRepository;

  constructor() {
    this.repository = new TwoFactorRepository();
  }

  // Setup 2FA with Authenticator App (TOTP)
  async setupAuthenticator(userId: string): Promise<{ success: true; data: TwoFactorSetupResponse } | { success: false; error: string }> {
    const user = await this.repository.findUserById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (user.isTwoFactorEnabled) {
      return { success: false, error: 'La autenticación de dos factores ya está habilitada' };
    }

    // Generate a random secret (base32 encoded)
    const secret = this.generateBase32Secret();

    // Save the secret (not yet enabled)
    await this.repository.updateUserTwoFactorSecret(userId, secret);

    // Generate TOTP URI for authenticator apps
    const otpauthUrl = this.generateTOTPUri(user.email || user.userName || userId, secret);

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(otpauthUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return {
      success: true,
      data: { secret, qrCode, method: 'AUTHENTICATOR' },
    };
  }

  // Setup 2FA with Email
  async setupEmail(userId: string): Promise<{ success: true; data: TwoFactorEmailSetupResponse } | { success: false; error: string }> {
    const user = await this.repository.findUserById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (user.isTwoFactorEnabled) {
      return { success: false, error: 'La autenticación de dos factores ya está habilitada' };
    }

    if (!user.email) {
      return { success: false, error: 'No tienes un email configurado' };
    }

    // Send verification code
    const code = generateSixDigitCode();
    const expires = new Date(Date.now() + TOKEN_EXPIRY.TWO_FACTOR);

    // Delete any existing tokens and create new one
    await this.repository.deleteTokensByEmail(user.email);
    await this.repository.createToken(user.email, code, expires);

    // Send email
    const emailResult = await sendTwoFactorEmail({
      to: user.email,
      code,
      userName: user.name ?? undefined,
    });

    if (!emailResult.success) {
      return { success: false, error: emailResult.error || 'Error al enviar el correo' };
    }

    return {
      success: true,
      data: { method: 'EMAIL', message: 'Código enviado a tu correo electrónico' },
    };
  }

  // Verify and enable 2FA with Authenticator
  async verifyAndEnableAuthenticator(
    userId: string,
    data: VerifyTwoFactorInput,
    options: TwoFactorOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const user = await this.repository.findUserById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (!user.twoFactorSecret) {
      return { success: false, error: 'No hay configuración de 2FA pendiente' };
    }

    // Verify the code
    const isValid = this.verifyTOTP(user.twoFactorSecret, data.code);

    if (!isValid) {
      return { success: false, error: 'Código inválido' };
    }

    // Enable 2FA with AUTHENTICATOR method
    await this.repository.enableTwoFactor(userId, 'AUTHENTICATOR');

    // Log 2FA enabled
    await auditLogsService.log('TWO_FACTOR_ENABLED', {
      userId,
      ipAddress,
      userAgent,
      metadata: { method: 'AUTHENTICATOR' },
    });

    return { success: true, message: 'Autenticación de dos factores habilitada con Google Authenticator' };
  }

  // Verify and enable 2FA with Email
  async verifyAndEnableEmail(
    userId: string,
    data: VerifyTwoFactorInput,
    options: TwoFactorOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const user = await this.repository.findUserById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (!user.email) {
      return { success: false, error: 'No tienes un email configurado' };
    }

    // Verify the email code
    const tokenRecord = await this.repository.findValidToken(user.email);

    if (!tokenRecord || tokenRecord.token !== data.code) {
      return { success: false, error: 'Código inválido o expirado' };
    }

    // Delete the used token
    await this.repository.deleteToken(tokenRecord.id);

    // Enable 2FA with EMAIL method
    await this.repository.enableTwoFactor(userId, 'EMAIL');

    // Log 2FA enabled
    await auditLogsService.log('TWO_FACTOR_ENABLED', {
      userId,
      ipAddress,
      userAgent,
      metadata: { method: 'EMAIL' },
    });

    return { success: true, message: 'Autenticación de dos factores habilitada por correo electrónico' };
  }

  async disableTwoFactor(
    userId: string,
    data: VerifyTwoFactorInput,
    options: TwoFactorOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const user = await this.repository.findUserById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (!user.isTwoFactorEnabled) {
      return { success: false, error: 'La autenticación de dos factores no está habilitada' };
    }

    const previousMethod = user.twoFactorMethod;

    // Verify based on method
    if (user.twoFactorMethod === 'AUTHENTICATOR') {
      if (!user.twoFactorSecret) {
        return { success: false, error: 'Configuración de 2FA corrupta' };
      }
      const isValid = this.verifyTOTP(user.twoFactorSecret, data.code);
      if (!isValid) {
        return { success: false, error: 'Código inválido' };
      }
    } else if (user.twoFactorMethod === 'EMAIL') {
      if (!user.email) {
        return { success: false, error: 'No tienes un email configurado' };
      }
      const tokenRecord = await this.repository.findValidToken(user.email);
      if (!tokenRecord || tokenRecord.token !== data.code) {
        return { success: false, error: 'Código inválido o expirado' };
      }
      await this.repository.deleteToken(tokenRecord.id);
    }

    // Disable 2FA
    await this.repository.disableTwoFactor(userId);

    // Log 2FA disabled
    await auditLogsService.log('TWO_FACTOR_DISABLED', {
      userId,
      ipAddress,
      userAgent,
      metadata: { previousMethod },
    });

    // Send security notification email
    if (user.email) {
      const deviceInfo = this.parseDeviceInfo(userAgent);
      await sendTwoFactorDisabledEmail({
        to: user.email,
        userName: user.name ?? undefined,
        disabledAt: new Date(),
        ipAddress,
        deviceInfo,
      });
    }

    return { success: true, message: 'Autenticación de dos factores deshabilitada' };
  }

  private parseDeviceInfo(userAgent?: string): string | undefined {
    if (!userAgent) return undefined;

    const ua = userAgent.toLowerCase();

    // Browser detection
    let browser = 'Navegador desconocido';
    if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

    // OS detection
    let os = '';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os') || ua.includes('macos')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    return os ? `${browser} en ${os}` : browser;
  }

  // Send code for disabling 2FA via email
  async sendDisableCode(userId: string): Promise<{ success: boolean; error?: string }> {
    const user = await this.repository.findUserById(userId);

    if (!user || !user.email) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const code = generateSixDigitCode();
    const expires = new Date(Date.now() + TOKEN_EXPIRY.TWO_FACTOR);

    await this.repository.deleteTokensByEmail(user.email);
    await this.repository.createToken(user.email, code, expires);

    const emailResult = await sendTwoFactorEmail({
      to: user.email,
      code,
      userName: user.name ?? undefined,
    });

    return emailResult;
  }

  async verifyTwoFactorLogin(
    data: VerifyTwoFactorLoginInput,
    options: TwoFactorOptions = {}
  ): Promise<{ success: true; data: TwoFactorLoginResponse; accessToken: string; refreshToken: string } | { success: false; error: string }> {
    const { ipAddress, userAgent, trustDevice } = options;
    const user = await this.repository.findUserById(data.userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (!user.isTwoFactorEnabled) {
      return { success: false, error: 'La autenticación de dos factores no está habilitada' };
    }

    // Verify based on method
    if (user.twoFactorMethod === 'AUTHENTICATOR') {
      if (!user.twoFactorSecret) {
        return { success: false, error: 'Configuración de 2FA corrupta' };
      }
      const isValid = this.verifyTOTP(user.twoFactorSecret, data.code);
      if (!isValid) {
        return { success: false, error: 'Código inválido' };
      }
    } else if (user.twoFactorMethod === 'EMAIL') {
      if (!user.email) {
        return { success: false, error: 'No tienes un email configurado' };
      }
      const tokenRecord = await this.repository.findValidToken(user.email);
      if (!tokenRecord || tokenRecord.token !== data.code) {
        return { success: false, error: 'Código inválido o expirado' };
      }
      await this.repository.deleteToken(tokenRecord.id);
    }

    // Trust device if requested
    if (trustDevice && ipAddress && userAgent) {
      await trustedDevicesService.trustDevice(user.id, userAgent, ipAddress);
    }

    const userData = {
      id: user.id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod as TwoFactorMethod | null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate access token (short-lived) with user data embedded
    const accessToken = sessionsService.generateAccessToken(user.id, user.email!, userData);

    // Generate refresh token (long-lived)
    const { token: refreshToken } = await sessionsService.createRefreshToken(
      user.id,
      { ipAddress, userAgent }
    );

    // Log successful 2FA verification and login
    await auditLogsService.log('TWO_FACTOR_VERIFIED', {
      userId: user.id,
      ipAddress,
      userAgent,
      metadata: { method: user.twoFactorMethod, deviceTrusted: !!trustDevice },
    });

    await auditLogsService.log('LOGIN_SUCCESS', {
      userId: user.id,
      ipAddress,
      userAgent,
      metadata: { via2FA: true, method: user.twoFactorMethod },
    });

    return {
      success: true,
      data: { user: userData },
      accessToken,
      refreshToken,
    };
  }

  // Send login 2FA code via email
  async sendLoginCode(userId: string): Promise<{ success: boolean; error?: string }> {
    const user = await this.repository.findUserById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (!user.email) {
      return { success: false, error: 'No tienes un email configurado' };
    }

    if (user.twoFactorMethod !== 'EMAIL') {
      return { success: false, error: 'Tu método de 2FA no es por correo' };
    }

    const code = generateSixDigitCode();
    const expires = new Date(Date.now() + TOKEN_EXPIRY.TWO_FACTOR);

    await this.repository.deleteTokensByEmail(user.email);
    await this.repository.createToken(user.email, code, expires);

    const emailResult = await sendTwoFactorEmail({
      to: user.email,
      code,
      userName: user.name ?? undefined,
    });

    return emailResult;
  }

  // Get user's 2FA method
  async getTwoFactorMethod(userId: string): Promise<{ method: TwoFactorMethod | null; enabled: boolean; backupCodesRemaining: number } | null> {
    const user = await this.repository.findUserById(userId);
    if (!user) return null;

    const backupCodesRemaining = await this.repository.countRemainingBackupCodes(userId);

    return {
      method: user.twoFactorMethod as TwoFactorMethod | null,
      enabled: user.isTwoFactorEnabled,
      backupCodesRemaining,
    };
  }

  // Backup Codes methods
  async generateBackupCodes(
    userId: string,
    options: TwoFactorOptions = {}
  ): Promise<{ success: true; data: BackupCodesResponse } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const user = await this.repository.findUserById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (!user.isTwoFactorEnabled) {
      return { success: false, error: 'Debes habilitar 2FA primero' };
    }

    // Delete existing backup codes
    await this.repository.deleteAllBackupCodes(userId);

    // Generate 10 new backup codes
    const codes = this.generateBackupCodesList(10);

    // Save hashed codes
    await this.repository.createBackupCodes(userId, codes);

    // Log backup codes generated
    await auditLogsService.log('BACKUP_CODES_GENERATED', {
      userId,
      ipAddress,
      userAgent,
      metadata: { codesGenerated: 10 },
    });

    return {
      success: true,
      data: {
        codes,
        message: 'Guarda estos códigos en un lugar seguro. Cada código solo puede usarse una vez.',
      },
    };
  }

  async verifyBackupCode(
    userId: string,
    code: string,
    options: TwoFactorOptions = {}
  ): Promise<{ success: true; remainingCodes: number } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;

    // Find all unused backup codes for this user
    const backupCodes = await this.repository.findUnusedBackupCodes(userId);

    if (backupCodes.length === 0) {
      return { success: false, error: 'No tienes códigos de respaldo disponibles' };
    }

    // Try to find matching code
    const normalizedCode = code.replace(/\s|-/g, '').toUpperCase();
    let matchedCode = null;

    for (const bc of backupCodes) {
      if (this.repository.verifyBackupCode(normalizedCode, bc.codeHash)) {
        matchedCode = bc;
        break;
      }
    }

    if (!matchedCode) {
      return { success: false, error: 'Código de respaldo inválido' };
    }

    // Mark code as used
    await this.repository.markBackupCodeAsUsed(matchedCode.id);

    // Log backup code used
    await auditLogsService.log('BACKUP_CODE_USED', {
      userId,
      ipAddress,
      userAgent,
      metadata: { remainingCodes: backupCodes.length - 1 },
    });

    return {
      success: true,
      remainingCodes: backupCodes.length - 1,
    };
  }

  async verifyTwoFactorLoginWithBackupCode(
    data: { userId: string; code: string },
    options: TwoFactorOptions = {}
  ): Promise<{ success: true; data: TwoFactorLoginResponse; accessToken: string; refreshToken: string; remainingCodes: number } | { success: false; error: string }> {
    const { ipAddress, userAgent, trustDevice } = options;
    const user = await this.repository.findUserById(data.userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (!user.isTwoFactorEnabled) {
      return { success: false, error: 'La autenticación de dos factores no está habilitada' };
    }

    // Verify backup code
    const verifyResult = await this.verifyBackupCode(data.userId, data.code, options);

    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error };
    }

    // Trust device if requested
    if (trustDevice && ipAddress && userAgent) {
      await trustedDevicesService.trustDevice(user.id, userAgent, ipAddress);
    }

    const userData = {
      id: user.id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod as TwoFactorMethod | null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate access token (short-lived) with user data embedded
    const accessToken = sessionsService.generateAccessToken(user.id, user.email!, userData);

    // Generate refresh token (long-lived)
    const { token: refreshToken } = await sessionsService.createRefreshToken(
      user.id,
      { ipAddress, userAgent }
    );

    // Log successful 2FA verification and login
    await auditLogsService.log('TWO_FACTOR_VERIFIED', {
      userId: user.id,
      ipAddress,
      userAgent,
      metadata: { method: 'BACKUP_CODE', deviceTrusted: !!trustDevice },
    });

    await auditLogsService.log('LOGIN_SUCCESS', {
      userId: user.id,
      ipAddress,
      userAgent,
      metadata: { via2FA: true, method: 'BACKUP_CODE' },
    });

    return {
      success: true,
      data: { user: userData },
      accessToken,
      refreshToken,
      remainingCodes: verifyResult.remainingCodes,
    };
  }

  /**
   * Check if a device is trusted for a user (skip 2FA)
   */
  async isDeviceTrusted(userId: string, userAgent?: string, ipAddress?: string): Promise<boolean> {
    if (!userAgent || !ipAddress) return false;
    return trustedDevicesService.isDeviceTrusted(userId, userAgent, ipAddress);
  }

  async getRemainingBackupCodes(userId: string): Promise<number> {
    return this.repository.countRemainingBackupCodes(userId);
  }

  private generateBackupCodesList(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8 character alphanumeric code
      const code = cryptoNode.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  // TOTP Helper methods
  private generateBase32Secret(length: number = 20): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < length; i++) {
      secret += chars[randomBytes[i] % chars.length];
    }
    return secret;
  }

  private generateTOTPUri(identifier: string, secret: string): string {
    const encodedIssuer = encodeURIComponent(APP_NAME);
    const encodedAccount = encodeURIComponent(identifier);
    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
  }

  private verifyTOTP(secret: string, code: string, window: number = 1): boolean {
    const currentTime = Math.floor(Date.now() / 1000 / 30);

    for (let i = -window; i <= window; i++) {
      const expectedCode = this.generateTOTPCode(secret, currentTime + i);
      if (expectedCode === code) {
        return true;
      }
    }

    return false;
  }

  private generateTOTPCode(secret: string, counter: number): string {
    // Convert counter to 8-byte buffer
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter, false);

    // Decode base32 secret
    const secretBytes = this.base32Decode(secret);

    // Calculate HMAC-SHA1
    const hmac = this.hmacSha1(secretBytes, new Uint8Array(counterBuffer));

    // Dynamic truncation
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = ((hmac[offset] & 0x7f) << 24) |
                 ((hmac[offset + 1] & 0xff) << 16) |
                 ((hmac[offset + 2] & 0xff) << 8) |
                 (hmac[offset + 3] & 0xff);

    // Return 6 digit code
    return (code % 1000000).toString().padStart(6, '0');
  }

  private base32Decode(encoded: string): Uint8Array {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleanedInput = encoded.toUpperCase().replace(/=+$/, '');

    let bits = 0;
    let value = 0;
    const output: number[] = [];

    for (const char of cleanedInput) {
      const index = alphabet.indexOf(char);
      if (index === -1) continue;

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        bits -= 8;
        output.push((value >>> bits) & 0xff);
      }
    }

    return new Uint8Array(output);
  }

  private hmacSha1(key: Uint8Array, message: Uint8Array): Uint8Array {
    const blockSize = 64;
    let keyToUse = key;

    // If key is longer than block size, hash it
    if (keyToUse.length > blockSize) {
      keyToUse = this.sha1(keyToUse);
    }

    // Pad key to block size
    const paddedKey = new Uint8Array(blockSize);
    paddedKey.set(keyToUse);

    // Create inner and outer padding
    const innerPad = new Uint8Array(blockSize);
    const outerPad = new Uint8Array(blockSize);

    for (let i = 0; i < blockSize; i++) {
      innerPad[i] = paddedKey[i] ^ 0x36;
      outerPad[i] = paddedKey[i] ^ 0x5c;
    }

    // inner = SHA1(innerPad || message)
    const innerData = new Uint8Array(blockSize + message.length);
    innerData.set(innerPad);
    innerData.set(message, blockSize);
    const inner = this.sha1(innerData);

    // outer = SHA1(outerPad || inner)
    const outerData = new Uint8Array(blockSize + 20);
    outerData.set(outerPad);
    outerData.set(inner, blockSize);

    return this.sha1(outerData);
  }

  private sha1(message: Uint8Array): Uint8Array {
    const rotateLeft = (n: number, s: number) => ((n << s) | (n >>> (32 - s))) >>> 0;

    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;
    let h4 = 0xc3d2e1f0;

    const msgLen = message.length;
    const bitLen = msgLen * 8;

    const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
    const padded = new Uint8Array(paddedLen);
    padded.set(message);
    padded[msgLen] = 0x80;

    const view = new DataView(padded.buffer);
    view.setUint32(paddedLen - 4, bitLen, false);

    for (let offset = 0; offset < paddedLen; offset += 64) {
      const w = new Uint32Array(80);

      for (let i = 0; i < 16; i++) {
        w[i] = view.getUint32(offset + i * 4, false);
      }

      for (let i = 16; i < 80; i++) {
        w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
      }

      let a = h0, b = h1, c = h2, d = h3, e = h4;

      for (let i = 0; i < 80; i++) {
        let f: number, k: number;

        if (i < 20) {
          f = (b & c) | (~b & d);
          k = 0x5a827999;
        } else if (i < 40) {
          f = b ^ c ^ d;
          k = 0x6ed9eba1;
        } else if (i < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8f1bbcdc;
        } else {
          f = b ^ c ^ d;
          k = 0xca62c1d6;
        }

        const temp = (rotateLeft(a, 5) + f + e + k + w[i]) >>> 0;
        e = d;
        d = c;
        c = rotateLeft(b, 30);
        b = a;
        a = temp;
      }

      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
    }

    const result = new Uint8Array(20);
    const resultView = new DataView(result.buffer);
    resultView.setUint32(0, h0, false);
    resultView.setUint32(4, h1, false);
    resultView.setUint32(8, h2, false);
    resultView.setUint32(12, h3, false);
    resultView.setUint32(16, h4, false);

    return result;
  }
}
