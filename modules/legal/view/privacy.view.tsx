import { LegalLayout } from '../components/legal-layout.component';

export function PrivacyView() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      description="Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información"
      lastUpdated="20 de enero de 2026"
      icon="privacy"
    >
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Información que Recopilamos</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">1.1 Información que nos proporcionas</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Información de cuenta:</strong> nombre, dirección de email, nombre de usuario</li>
            <li><strong>Credenciales de seguridad:</strong> contraseña (almacenada de forma segura mediante hash)</li>
            <li><strong>Configuración de 2FA:</strong> método preferido de autenticación</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">1.2 Información recopilada automáticamente</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Información del dispositivo:</strong> tipo de navegador, sistema operativo, identificador del dispositivo</li>
            <li><strong>Información de ubicación:</strong> dirección IP, país y ciudad aproximada</li>
            <li><strong>Información de uso:</strong> fechas y horas de acceso, acciones realizadas</li>
            <li><strong>Cookies y tecnologías similares:</strong> tokens de sesión, preferencias</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Cómo Usamos tu Información</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Proporcionar, mantener y mejorar nuestros servicios de autenticación</li>
            <li>Verificar tu identidad y procesar el inicio de sesión</li>
            <li>Enviar códigos de verificación y enlaces de acceso</li>
            <li>Detectar y prevenir actividades fraudulentas o sospechosas</li>
            <li>Gestionar sesiones activas y dispositivos de confianza</li>
            <li>Generar registros de auditoría para tu seguridad</li>
            <li>Comunicarte cambios importantes en el servicio</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Seguridad de los Datos</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Cifrado de contraseñas:</strong> utilizamos bcrypt con factor de costo elevado</li>
            <li><strong>Tokens seguros:</strong> JWT con firma criptográfica y expiración</li>
            <li><strong>Conexiones seguras:</strong> HTTPS obligatorio para todas las comunicaciones</li>
            <li><strong>Cookies HttpOnly:</strong> protección contra ataques XSS</li>
            <li><strong>Rate limiting:</strong> protección contra ataques de fuerza bruta</li>
            <li><strong>Detección de anomalías:</strong> alertas por accesos desde ubicaciones inusuales</li>
            <li><strong>Historial de contraseñas:</strong> prevención de reutilización de contraseñas</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Retención de Datos</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Conservamos tu información durante diferentes períodos según su tipo:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Datos de cuenta:</strong> mientras tu cuenta esté activa</li>
            <li><strong>Registros de actividad:</strong> 90 días para auditoría de seguridad</li>
            <li><strong>Sesiones:</strong> hasta 7 días de inactividad o cierre manual</li>
            <li><strong>Tokens de verificación:</strong> 24 horas máximo</li>
            <li><strong>Códigos de respaldo:</strong> hasta que sean usados o regenerados</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Tras la eliminación de tu cuenta, tus datos personales serán eliminados en un plazo de 30 días,
            excepto cuando la ley requiera su conservación por más tiempo.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Compartición de Datos</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            No vendemos tu información personal. Podemos compartir datos en las siguientes circunstancias:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Proveedores de servicios:</strong> empresas que nos ayudan a operar (ej: envío de emails)</li>
            <li><strong>Cumplimiento legal:</strong> cuando lo requiera la ley o una orden judicial</li>
            <li><strong>Protección de derechos:</strong> para proteger nuestros derechos, privacidad, seguridad o propiedad</li>
            <li><strong>Transacciones corporativas:</strong> en caso de fusión, adquisición o venta de activos</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Tus Derechos (GDPR)</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            De acuerdo con el Reglamento General de Protección de Datos, tienes derecho a:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Acceso:</strong> solicitar una copia de tus datos personales</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
            <li><strong>Eliminación:</strong> solicitar la eliminación de tus datos ("derecho al olvido")</li>
            <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado (JSON)</li>
            <li><strong>Oposición:</strong> oponerte al procesamiento de tus datos</li>
            <li><strong>Limitación:</strong> restringir el procesamiento de tus datos</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Puedes ejercer estos derechos desde la sección "Privacidad y Datos" en tu perfil,
            o contactándonos directamente.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Utilizamos cookies esenciales para el funcionamiento del servicio:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>auth_token:</strong> token de autenticación (HttpOnly, Secure)</li>
            <li><strong>refresh_token:</strong> token de renovación de sesión (HttpOnly, Secure)</li>
            <li><strong>trusted_device:</strong> identificador de dispositivo de confianza</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            No utilizamos cookies de seguimiento ni publicidad. Las cookies de sesión se eliminan
            al cerrar sesión o expirar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Transferencias Internacionales</h2>
          <p className="text-muted-foreground leading-relaxed">
            Tus datos pueden ser procesados en servidores ubicados fuera de tu país de residencia.
            En tales casos, nos aseguramos de que existan salvaguardas adecuadas para proteger tu
            información, como cláusulas contractuales estándar aprobadas por la Comisión Europea.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Menores de Edad</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
            conscientemente información de menores. Si descubrimos que hemos recopilado
            datos de un menor, tomaremos medidas para eliminar dicha información.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Cambios en esta Política</h2>
          <p className="text-muted-foreground leading-relaxed">
            Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios
            significativos mediante email o un aviso en nuestro sitio. Te recomendamos revisar
            esta política regularmente para estar informado sobre cómo protegemos tu información.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Contacto</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para preguntas sobre esta Política de Privacidad o para ejercer tus derechos, contacta a nuestro
            Delegado de Protección de Datos en:{' '}
            <a href="mailto:privacy@secureauth.com" className="text-primary hover:underline">
              privacy@secureauth.com
            </a>
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
