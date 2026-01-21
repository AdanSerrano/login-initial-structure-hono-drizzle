import { Suspense } from "react";
import { AdminUsersView } from "@/modules/admin/users/view/admin-users.view";
import { AdminUsersSkeleton } from "@/modules/admin/users/components/admin-users.skeleton";

export const metadata = {
  title: "Gestión de Usuarios | Admin",
  description: "Administra los usuarios del sistema",
};

export default function UserAdminPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<AdminUsersSkeleton />}>
        <AdminUsersView />
      </Suspense>
    </div>
  );
}
