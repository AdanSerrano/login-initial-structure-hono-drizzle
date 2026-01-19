import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface TwoFactorEmailProps {
  code: string;
  userName?: string;
}

export function TwoFactorEmail({ code, userName }: TwoFactorEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu código de verificación</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Código de verificación</Heading>

          <Text style={text}>
            Hola{userName ? ` ${userName}` : ''},
          </Text>

          <Text style={text}>
            Tu código de verificación de dos factores es:
          </Text>

          <Section style={codeContainer}>
            <Text style={codeStyle}>{code}</Text>
          </Section>

          <Text style={text}>
            Este código expirará en 5 minutos.
          </Text>

          <Text style={footer}>
            Si no solicitaste este código, ignora este correo o contacta al soporte
            si crees que tu cuenta ha sido comprometida.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  borderRadius: '8px',
  maxWidth: '465px',
};

const heading = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#484848',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
};

const codeContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  padding: '24px',
};

const codeStyle = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '8px',
  margin: 0,
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0 0',
};
