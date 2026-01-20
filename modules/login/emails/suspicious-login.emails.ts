import { resend } from '@/lib/email';

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export interface SuspiciousLoginEmailOptions {
  to: string;
  userName?: string;
  loginAt: Date;
  newLocation: {
    country?: string;
    city?: string;
  };
  previousLocation?: {
    country?: string;
    city?: string;
  };
  ipAddress?: string;
  deviceInfo?: string;
}

function getSuspiciousLoginEmailHtml({
  userName,
  loginAt,
  newLocation,
  previousLocation,
  ipAddress,
  deviceInfo,
}: Omit<SuspiciousLoginEmailOptions, 'to'>) {
  const formattedDate = loginAt.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatLocation = (loc?: { country?: string; city?: string }) => {
    if (!loc) return 'Desconocida';
    const parts = [loc.city, loc.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Desconocida';
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inicio de sesión desde nueva ubicación</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background-color: #fee2e2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px;">🚨</span>
            </div>
          </div>

          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 20px 0;">
            Nueva ubicación detectada
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hola${userName ? ` ${userName}` : ''},
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hemos detectado un inicio de sesión en tu cuenta desde una <strong>ubicación diferente</strong> a la habitual.
          </p>

          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #374151; font-size: 14px; margin: 0 0 12px 0;"><strong>Detalles del inicio de sesión:</strong></p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #6b7280; font-size: 13px; padding: 4px 0; vertical-align: top;">📍 <strong>Nueva ubicación:</strong></td>
                <td style="color: #dc2626; font-size: 13px; padding: 4px 0; font-weight: 600;">${formatLocation(newLocation)}</td>
              </tr>
              ${previousLocation ? `
              <tr>
                <td style="color: #6b7280; font-size: 13px; padding: 4px 0; vertical-align: top;">📍 <strong>Ubicación anterior:</strong></td>
                <td style="color: #059669; font-size: 13px; padding: 4px 0;">${formatLocation(previousLocation)}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="color: #6b7280; font-size: 13px; padding: 4px 0; vertical-align: top;">📅 <strong>Fecha:</strong></td>
                <td style="color: #374151; font-size: 13px; padding: 4px 0;">${formattedDate}</td>
              </tr>
              ${ipAddress ? `
              <tr>
                <td style="color: #6b7280; font-size: 13px; padding: 4px 0; vertical-align: top;">🌐 <strong>IP:</strong></td>
                <td style="color: #374151; font-size: 13px; padding: 4px 0;">${ipAddress}</td>
              </tr>
              ` : ''}
              ${deviceInfo ? `
              <tr>
                <td style="color: #6b7280; font-size: 13px; padding: 4px 0; vertical-align: top;">💻 <strong>Dispositivo:</strong></td>
                <td style="color: #374151; font-size: 13px; padding: 4px 0;">${deviceInfo}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Si fuiste tú quien inició sesión, puedes ignorar este mensaje. Tu cuenta está segura.
          </p>

          <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #92400e; font-size: 14px; line-height: 20px; margin: 0;">
              <strong>⚠️ ¿No reconoces esta actividad?</strong><br>
              Si no fuiste tú quien inició sesión, te recomendamos:
            </p>
            <ul style="color: #92400e; font-size: 13px; margin: 8px 0 0 0; padding-left: 20px;">
              <li>Cambiar tu contraseña inmediatamente</li>
              <li>Revisar y cerrar sesiones activas sospechosas</li>
              <li>Habilitar la autenticación de dos factores si no lo has hecho</li>
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

export async function sendSuspiciousLoginEmail(options: SuspiciousLoginEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: options.to,
      subject: '🚨 Inicio de sesión desde nueva ubicación',
      html: getSuspiciousLoginEmailHtml(options),
    });

    if (error) {
      console.error('Error sending suspicious login email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending suspicious login email:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}
