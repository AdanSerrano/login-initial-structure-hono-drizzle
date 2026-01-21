import type { AdminUser } from "../../types/admin-users.types";

export function UserExpandedContent({ user }: { user: AdminUser }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Información Personal</h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">ID:</span> {user.id}
          </p>
          <p>
            <span className="text-muted-foreground">Nombre:</span> {user.name || "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Usuario:</span>{" "}
            {user.userName ? `@${user.userName}` : "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> {user.email}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Seguridad</h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Email verificado:</span>{" "}
            {user.emailVerified ? "Sí" : "No"}
          </p>
          <p>
            <span className="text-muted-foreground">2FA:</span>{" "}
            {user.isTwoFactorEnabled ? `Activo (${user.twoFactorMethod})` : "Desactivado"}
          </p>
          <p>
            <span className="text-muted-foreground">Intentos fallidos:</span>{" "}
            {user.failedLoginAttempts}
          </p>
          <p>
            <span className="text-muted-foreground">Bloqueado hasta:</span>{" "}
            {user.lockedUntil ? new Date(user.lockedUntil).toLocaleString() : "-"}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Último Acceso</h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Fecha:</span>{" "}
            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "-"}
          </p>
          <p>
            <span className="text-muted-foreground">IP:</span> {user.lastLoginIp || "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Ubicación:</span>{" "}
            {user.lastLoginCity && user.lastLoginCountry
              ? `${user.lastLoginCity}, ${user.lastLoginCountry}`
              : "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Sesiones:</span> {user.sessionsCount ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
