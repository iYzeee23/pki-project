import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/auth-store";
import { LoginPage } from "./pages/auth/login-page";
import { ProtectedRoute } from "./main/protected-route";
import { AdminLayout } from "./main/admin-layout";
import { ProfilePage } from "./pages/profile/profile-page";
import { EditProfilePage } from "./pages/profile/edit-profile-page";
import { ChangePasswordPage } from "./pages/profile/change-password-page";

function Placeholder({ title }: { title: string }) {
  return <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>;
}

export function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<LoginPage />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/profile" replace />} />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/password" element={<ChangePasswordPage />} />

            <Route path="/map" element={<Placeholder title="Mapa (uskoro)" />} />
            <Route path="/rentals" element={<Placeholder title="Iznajmljivanja (uskoro)" />} />
            <Route path="/issues" element={<Placeholder title="Neispravnosti (uskoro)" />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
