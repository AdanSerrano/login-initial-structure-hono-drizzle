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
