import { Metadata } from 'next';
import { PrivacyView } from '@/modules/legal/view/privacy.view';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de SecureAuth. Conoce cómo recopilamos, usamos y protegemos tu información personal.',
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
