import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface PasswordResetEmailProps {
  resetLink: string;
  userName?: string;
}

export function PasswordResetEmail({ resetLink, userName }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Restablecer contraseña</Heading>

          <Text style={text}>
            Hola{userName ? ` ${userName}` : ''},
          </Text>

          <Text style={text}>
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
            Si no realizaste esta solicitud, puedes ignorar este correo.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Restablecer contraseña
            </Button>
          </Section>

          <Text style={text}>
            O copia y pega este enlace en tu navegador:
          </Text>

          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>

          <Text style={footer}>
            Este enlace expirará en 1 hora por razones de seguridad.
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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
};

const link = {
  color: '#2754C5',
  fontSize: '12px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0 0',
};
