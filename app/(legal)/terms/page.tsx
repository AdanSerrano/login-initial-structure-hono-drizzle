import { Metadata } from 'next';
import { TermsView } from '@/modules/legal/view/terms.view';

export const metadata: Metadata = {
  title: 'Términos de Servicio',
  description: 'Términos y condiciones de uso de SecureAuth. Lee nuestras políticas antes de utilizar el servicio.',
};

export default function TermsPage() {
  return <TermsView />;
}
