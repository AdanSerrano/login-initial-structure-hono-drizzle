import { resend } from '@/lib/email';

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SendEmailChangeVerificationOptions {
  to: string;
  userName?: string;
  token: string;
  currentEmail: string;
}

function getEmailChangeVerificationHtml({
  userName,
  token,
  currentEmail,
}: Omit<SendEmailChangeVerificationOptions, 'to'>) {
  const verifyUrl = `${APP_URL}/verify-email-change?token=${token}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificar nuevo correo electrónico</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background-color: #dbeafe; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px;">📧</span>
            </div>
          </div>

          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 20px 0;">
            Verifica tu nuevo correo
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hola${userName ? ` ${userName}` : ''},
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Recibimos una solicitud para cambiar tu correo electrónico de <strong>${currentEmail}</strong> a esta dirección.
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Por favor, haz clic en el siguiente botón para confirmar este cambio:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
              Verificar nuevo correo
            </a>
          </div>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 24px 0 0 0;">
            Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este correo y tu email actual permanecerá sin cambios.
          </p>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 16px 0 0 0;">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
            <a href="${verifyUrl}" style="color: #2563eb; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendEmailChangeVerification(options: SendEmailChangeVerificationOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: options.to,
      subject: 'Verifica tu nuevo correo electrónico',
      html: getEmailChangeVerificationHtml(options),
    });

    if (error) {
      console.error('Error sending email change verification:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email change verification:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}

// Notification sent to the OLD email when the change is complete
interface SendEmailChangedNotificationOptions {
  to: string;
  userName?: string;
  newEmail: string;
  changedAt: Date;
}

function getEmailChangedNotificationHtml({
  userName,
  newEmail,
  changedAt,
}: Omit<SendEmailChangedNotificationOptions, 'to'>) {
  const formattedDate = changedAt.toLocaleDateString('es-ES', {
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
        <title>Tu correo electrónico ha sido cambiado</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; padding: 40px 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background-color: #fef3c7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px;">⚠️</span>
            </div>
          </div>

          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 20px 0;">
            Correo electrónico cambiado
          </h1>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hola${userName ? ` ${userName}` : ''},
          </p>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Te informamos que el correo electrónico asociado a tu cuenta ha sido cambiado.
          </p>

          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #374151; font-size: 13px; margin: 0 0 8px 0;"><strong>Detalles del cambio:</strong></p>
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0;">
              📧 <strong>Nuevo correo:</strong> ${newEmail}
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0;">
              📅 <strong>Fecha:</strong> ${formattedDate}
            </p>
          </div>

          <p style="color: #484848; font-size: 14px; line-height: 24px; margin: 16px 0;">
            Si fuiste tú quien realizó este cambio, no necesitas hacer nada más.
          </p>

          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #991b1b; font-size: 14px; line-height: 20px; margin: 0;">
              <strong>⚠️ ¿No reconoces este cambio?</strong><br>
              Si no fuiste tú, por favor contacta con nuestro equipo de soporte inmediatamente.
            </p>
          </div>

          <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 32px 0 0 0; text-align: center;">
            Este es un correo automático de seguridad. Por favor, no respondas a este mensaje.
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendEmailChangedNotification(options: SendEmailChangedNotificationOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: options.to,
      subject: '⚠️ Tu correo electrónico ha sido cambiado',
      html: getEmailChangedNotificationHtml(options),
    });

    if (error) {
      console.error('Error sending email changed notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email changed notification:', error);
    const message = error instanceof Error ? error.message : 'Error al enviar el correo';
    return { success: false, error: message };
  }
}
