import { useRegister } from '../hooks/register.hook';
import type { RegisterInput } from '../validations/schema/register.schema';

export function RegisterViewModel() {
  const { register, isPending, error } = useRegister();

  const handleRegister = async (values: RegisterInput) => {
    await register(values);
  };

  return {
    handleRegister,
    isPending,
    error,
  };
}
