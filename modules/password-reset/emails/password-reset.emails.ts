import { resend } from '@/lib/email';

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

interface SendPasswordResetEmailOptions {
  to: string;
  resetLink: string;
  userName?: string;
}

function getPasswordResetEmailHtml({ resetLink, userName }: { resetLink: string; userName?: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer contraseña</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 30px 0;">
            Restablecer contraseña
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hola${userName ? ` ${userName}` : ''},
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background-color: #000000; border-radius: 6px; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; text-align: center; padding: 12px 24px; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            O copia y pega este enlace en tu navegador:
          </p>

          <a href="${resetLink}" style="color: #2754C5; font-size: 12px; text-decoration: underline; word-break: break-all;">
            ${resetLink}
          </a>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 32px 0 0 0;">
            Este enlace expirará en 1 hora. Si no solicitaste restablecer tu contraseña, ignora este correo.
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendPasswordResetEmail({ to, resetLink, userName }: SendPasswordResetEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject: 'Restablecer contraseña',
      html: getPasswordResetEmailHtml({ resetLink, userName }),
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}
