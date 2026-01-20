import { resend } from '@/lib/email';

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SendMagicLinkEmailOptions {
  to: string;
  token: string;
  isNewUser: boolean;
}

function getMagicLinkEmailHtml({ token, isNewUser }: Omit<SendMagicLinkEmailOptions, 'to'>) {
  const verifyUrl = `${APP_URL}/magic-link/verify?token=${token}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isNewUser ? 'Crea tu cuenta' : 'Iniciar sesión'}</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background-color: #dbeafe; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px;">✨</span>
            </div>
          </div>

          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 20px 0;">
            ${isNewUser ? 'Bienvenido' : 'Iniciar sesión'}
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0; text-align: center;">
            ${isNewUser
              ? 'Haz clic en el siguiente botón para crear tu cuenta y comenzar.'
              : 'Haz clic en el siguiente botón para iniciar sesión de forma segura sin necesidad de contraseña.'}
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px; display: inline-block;">
              ${isNewUser ? 'Crear mi cuenta' : 'Iniciar sesión'}
            </a>
          </div>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 24px 0 0 0; text-align: center;">
            Este enlace expirará en 10 minutos. Si no solicitaste este correo, puedes ignorarlo de forma segura.
          </p>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 16px 0 0 0; text-align: center;">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
            <a href="${verifyUrl}" style="color: #2563eb; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendMagicLinkEmail(options: SendMagicLinkEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: options.to,
      subject: options.isNewUser ? '✨ Crea tu cuenta' : '✨ Tu enlace para iniciar sesión',
      html: getMagicLinkEmailHtml(options),
    });

    if (error) {
      console.error('Error sending magic link email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending magic link email:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}
