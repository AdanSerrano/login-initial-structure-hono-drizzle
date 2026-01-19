'use client';

import { useTwoFactorLoginViewModel } from '../view-model/two-factor.view-model';
import { TwoFactorForm } from '../components/form/two-factor.form';

interface Props {
  userId: string;
  onCancel?: () => void;
}

export function TwoFactorLoginView({ userId, onCancel }: Props) {
  const { verifyLogin, isPending, error } = useTwoFactorLoginViewModel();

  const handleSubmit = async (values: { code: string }) => {
    await verifyLogin({ userId, code: values.code });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Verificación de dos factores</h2>
        <p className="text-gray-600 mt-2">
          Ingresa el código de tu aplicación autenticadora
        </p>
      </div>

      <TwoFactorForm
        onSubmit={handleSubmit}
        isPending={isPending}
        error={error}
        submitText="Iniciar sesión"
      />

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-sm text-gray-500 hover:underline"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
