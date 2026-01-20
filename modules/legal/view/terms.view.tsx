import { LegalLayout } from '../components/legal-layout.component';

export function TermsView() {
  return (
    <LegalLayout
      title="Términos de Servicio"
      description="Por favor, lee detenidamente estos términos antes de utilizar nuestros servicios"
      lastUpdated="20 de enero de 2026"
      icon="terms"
    >
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceptación de los Términos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Al acceder y utilizar SecureAuth, aceptas estar sujeto a estos Términos de Servicio y todas
            las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos,
            no debes utilizar nuestros servicios.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Descripción del Servicio</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            SecureAuth proporciona un sistema de autenticación seguro que incluye:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Autenticación mediante email y contraseña</li>
            <li>Autenticación de dos factores (2FA) mediante aplicación o email</li>
            <li>Inicio de sesión sin contraseña mediante Magic Link</li>
            <li>Gestión de sesiones y dispositivos</li>
            <li>Registro de actividad y auditoría de seguridad</li>
            <li>Exportación de datos personales (GDPR)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Registro de Cuenta</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Para utilizar nuestros servicios, debes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Proporcionar información precisa y completa durante el registro</li>
            <li>Mantener la confidencialidad de tu contraseña y credenciales de acceso</li>
            <li>Ser responsable de todas las actividades que ocurran bajo tu cuenta</li>
            <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
            <li>Tener al menos 18 años de edad o la mayoría de edad en tu jurisdicción</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Uso Aceptable</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Al utilizar nuestros servicios, te comprometes a no:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Violar leyes, regulaciones o derechos de terceros</li>
            <li>Intentar acceder a cuentas de otros usuarios sin autorización</li>
            <li>Utilizar el servicio para actividades fraudulentas o ilegales</li>
            <li>Interferir con el funcionamiento normal del servicio</li>
            <li>Intentar eludir las medidas de seguridad implementadas</li>
            <li>Compartir tus credenciales de acceso con terceros</li>
            <li>Utilizar bots, scripts o herramientas automatizadas sin autorización</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Seguridad de la Cuenta</h2>
          <p className="text-muted-foreground leading-relaxed">
            Implementamos medidas de seguridad robustas para proteger tu cuenta, incluyendo
            cifrado de contraseñas, tokens JWT seguros, y detección de actividad sospechosa.
            Sin embargo, ningún sistema es completamente seguro. Recomendamos encarecidamente
            habilitar la autenticación de dos factores (2FA) y utilizar contraseñas únicas y
            robustas.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Propiedad Intelectual</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todos los derechos de propiedad intelectual relacionados con SecureAuth, incluyendo
            pero no limitado a software, diseño, logos, y contenido, son propiedad de SecureAuth
            o sus licenciantes. No se te concede ningún derecho sobre estos elementos más allá
            del uso personal del servicio.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitación de Responsabilidad</h2>
          <p className="text-muted-foreground leading-relaxed">
            SecureAuth se proporciona "tal cual" sin garantías de ningún tipo. No seremos
            responsables por daños directos, indirectos, incidentales o consecuentes que
            resulten del uso o la imposibilidad de usar nuestros servicios, incluyendo pero
            no limitado a pérdida de datos, interrupción del servicio o acceso no autorizado
            a tu cuenta.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Terminación</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nos reservamos el derecho de suspender o terminar tu acceso al servicio en
            cualquier momento, con o sin causa, y con o sin previo aviso. Puedes cancelar
            tu cuenta en cualquier momento desde la configuración de tu perfil. Tras la
            cancelación, tus datos serán eliminados de acuerdo con nuestra Política de Privacidad.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Modificaciones</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Te notificaremos sobre cambios significativos a través del email asociado a
            tu cuenta o mediante un aviso destacado en nuestro sitio. El uso continuado
            del servicio después de dichas modificaciones constituye tu aceptación de los
            nuevos términos.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Ley Aplicable</h2>
          <p className="text-muted-foreground leading-relaxed">
            Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables,
            sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier
            disputa que surja de estos términos será resuelta en los tribunales competentes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Contacto</h2>
          <p className="text-muted-foreground leading-relaxed">
            Si tienes preguntas sobre estos Términos de Servicio, puedes contactarnos en:{' '}
            <a href="mailto:legal@secureauth.com" className="text-primary hover:underline">
              legal@secureauth.com
            </a>
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
