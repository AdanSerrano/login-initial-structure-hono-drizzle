import { UserRepository } from '../repository/user.repository';
import type { UpdateUserInput } from '../validations/schema/user.schema';
import type { UserResponse, TwoFactorMethod } from '../types/user.types';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getUser(userId: string): Promise<{ success: true; data: UserResponse } | { success: false; error: string }> {
    const user = await this.repository.findById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    return {
      success: true,
      data: {
        id: user.id,
        userName: user.userName,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        twoFactorMethod: user.twoFactorMethod as TwoFactorMethod | null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async updateUser(userId: string, data: UpdateUserInput): Promise<{ success: true; data: UserResponse } | { success: false; error: string }> {
    const user = await this.repository.findById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Check if userName is taken by another user
    if (data.userName && data.userName !== user.userName) {
      const existingUser = await this.repository.findByUserName(data.userName);
      if (existingUser && existingUser.id !== userId) {
        return { success: false, error: 'El nombre de usuario ya está en uso' };
      }
    }

    const updatedUser = await this.repository.update(userId, data);

    if (!updatedUser) {
      return { success: false, error: 'Error al actualizar el usuario' };
    }

    return {
      success: true,
      data: {
        id: updatedUser.id,
        userName: updatedUser.userName,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        role: updatedUser.role,
        isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
        twoFactorMethod: updatedUser.twoFactorMethod as TwoFactorMethod | null,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }

  async deleteUser(userId: string): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const user = await this.repository.findById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    await this.repository.delete(userId);

    return { success: true, message: 'Usuario eliminado correctamente' };
  }
}
