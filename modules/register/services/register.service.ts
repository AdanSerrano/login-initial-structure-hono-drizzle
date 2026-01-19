import bcrypt from 'bcryptjs';
import { RegisterRepository } from '../repository/register.repository';
import { EmailVerificationService } from '@/modules/email-verification/services/email-verification.service';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import type { RegisterInput } from '../validations/schema/register.schema';

const BCRYPT_SALT_ROUNDS = 10;

export interface RegisterOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class RegisterService {
  private repository: RegisterRepository;
  private emailVerificationService: EmailVerificationService;

  constructor() {
    this.repository = new RegisterRepository();
    this.emailVerificationService = new EmailVerificationService();
  }

  async register(
    data: RegisterInput,
    options: RegisterOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;

    // Check if email or username already exists
    const existingByEmail = await this.repository.findByEmail(data.email);
    if (existingByEmail) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const existingByUserName = await this.repository.findByUserName(data.userName);
    if (existingByUserName) {
      return { success: false, error: 'El nombre de usuario ya está en uso' };
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    const { confirmPassword, ...userData } = data;

    const newUser = await this.repository.create({
      ...userData,
      password: hashedPassword,
    });

    // Log the registration
    await auditLogsService.log('REGISTRATION', {
      userId: newUser.id,
      ipAddress,
      userAgent,
      metadata: { email: data.email, userName: data.userName },
    });

    // Send verification email
    const emailResult = await this.emailVerificationService.sendVerificationEmailToUser(
      data.email,
      data.name ?? undefined
    );

    if (!emailResult.success) {
      console.error('Error sending verification email:', emailResult.error);
    }

    return {
      success: true,
      message: 'Cuenta creada. Por favor verifica tu correo electrónico para activar tu cuenta.',
    };
  }
}
