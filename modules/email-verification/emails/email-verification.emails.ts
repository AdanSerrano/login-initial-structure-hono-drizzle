import { resend } from '@/lib/email';

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

interface SendVerificationEmailOptions {
  to: string;
  verificationLink: string;
  userName?: string;
}

function getVerificationEmailHtml({ verificationLink, userName }: { verificationLink: string; userName?: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifica tu correo electrónico</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 30px 0;">
            Verifica tu correo
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hola${userName ? ` ${userName}` : ''},
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Gracias por registrarte. Por favor, verifica tu correo electrónico haciendo clic en el botón de abajo.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationLink}" style="background-color: #000000; border-radius: 6px; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; text-align: center; padding: 12px 24px; display: inline-block;">
              Verificar correo
            </a>
          </div>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            O copia y pega este enlace en tu navegador:
          </p>

          <a href="${verificationLink}" style="color: #2754C5; font-size: 12px; text-decoration: underline; word-break: break-all;">
            ${verificationLink}
          </a>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 32px 0 0 0;">
            Este enlace expirará en 24 horas.
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendVerificationEmail({ to, verificationLink, userName }: SendVerificationEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject: 'Verifica tu correo electrónico',
      html: getVerificationEmailHtml({ verificationLink, userName }),
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}
