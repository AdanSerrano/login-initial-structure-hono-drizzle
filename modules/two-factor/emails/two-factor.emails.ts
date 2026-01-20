import { resend } from '@/lib/email';

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

interface SendTwoFactorEmailOptions {
  to: string;
  code: string;
  userName?: string;
}

function getTwoFactorEmailHtml({ code, userName }: { code: string; userName?: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tu código de verificación</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 30px 0;">
            Código de verificación
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hola${userName ? ` ${userName}` : ''},
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Tu código de verificación es:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <span style="background-color: #f4f4f5; border-radius: 8px; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 24px; display: inline-block; color: #1a1a1a;">
              ${code}
            </span>
          </div>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Ingresa este código en la aplicación para completar la verificación.
          </p>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 32px 0 0 0;">
            Este código expirará en 5 minutos. Si no solicitaste este código, ignora este correo.
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendTwoFactorEmail({ to, code, userName }: SendTwoFactorEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject: 'Tu código de verificación',
      html: getTwoFactorEmailHtml({ code, userName }),
    });

    if (error) {
      console.error('Error sending two-factor email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending two-factor email:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}

// Email notification when 2FA is disabled
interface SendTwoFactorDisabledEmailOptions {
  to: string;
  userName?: string;
  disabledAt: Date;
  ipAddress?: string;
  deviceInfo?: string;
}

function getTwoFactorDisabledEmailHtml({
  userName,
  disabledAt,
  ipAddress,
  deviceInfo,
}: Omit<SendTwoFactorDisabledEmailOptions, 'to'>) {
  const formattedDate = disabledAt.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Autenticación de dos factores deshabilitada</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background-color: #fef3c7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px;">⚠️</span>
            </div>
          </div>

          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 20px 0;">
            2FA deshabilitada
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hola${userName ? ` ${userName}` : ''},
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Te informamos que la <strong>autenticación de dos factores (2FA)</strong> ha sido <strong style="color: #dc2626;">deshabilitada</strong> en tu cuenta.
          </p>

          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #374151; font-size: 13px; margin: 0 0 8px 0;"><strong>Detalles:</strong></p>
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0;">
              📅 <strong>Fecha:</strong> ${formattedDate}
            </p>
            ${ipAddress ? `
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0;">
              🌐 <strong>IP:</strong> ${ipAddress}
            </p>
            ` : ''}
            ${deviceInfo ? `
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0;">
              💻 <strong>Dispositivo:</strong> ${deviceInfo}
            </p>
            ` : ''}
          </div>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Si fuiste tú quien realizó esta acción, no necesitas hacer nada más. Tu cuenta ahora está protegida solo con tu contraseña.
          </p>

          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #991b1b; font-size: 14px; line-height: 20px; margin: 0;">
              <strong>⚠️ ¿No fuiste tú?</strong><br>
              Si no reconoces esta actividad, te recomendamos:
            </p>
            <ul style="color: #991b1b; font-size: 13px; margin: 8px 0 0 0; padding-left: 20px;">
              <li>Cambiar tu contraseña inmediatamente</li>
              <li>Volver a habilitar la autenticación de dos factores</li>
              <li>Revisar la actividad reciente de tu cuenta</li>
            </ul>
          </div>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 32px 0 0 0; text-align: center;">
            Este es un correo automático de seguridad. Por favor, no respondas a este mensaje.
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendTwoFactorDisabledEmail({
  to,
  userName,
  disabledAt,
  ipAddress,
  deviceInfo,
}: SendTwoFactorDisabledEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject: '⚠️ Autenticación de dos factores deshabilitada',
      html: getTwoFactorDisabledEmailHtml({ userName, disabledAt, ipAddress, deviceInfo }),
    });

    if (error) {
      console.error('Error sending 2FA disabled email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending 2FA disabled email:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}
