import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./stores/auth-store";
import { IndexRoute } from "./main/index-route";
import { LoginPage } from "./pages/auth/login-page";
import { ProtectedRoute } from "./main/protected-route";
import { AdminLayout } from "./main/admin-layout";
import { ProfilePage } from "./pages/profile/profile-page";
import { EditProfilePage } from "./pages/profile/edit-profile-page";
import { ChangePasswordPage } from "./pages/profile/change-password-page";
import { MapPage } from "./pages/features/map-page";
import { ParkingDetailsPanel } from "./panels/parking-details-panel";
import { RentalsPage } from "./pages/features/rentals-page";
import { IssuesPage } from "./pages/features/issues-page";
import { BikeDetailsPanel } from "./panels/bike/bike-details-panel";
import { BikeEditPanel } from "./panels/bike/bike-edit-panel";
import { RentalImagesPanel } from "./panels/rental/rental-images-panel";
import { RentalDetailsPanel } from "./panels/rental/rental-details-panel";
import { IssueDetailsPanel } from "./panels/issue/issue-details-panel";
import { IssueImagesPanel } from "./panels/issue/issue-images-panel";

export function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexRoute />} />

        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/password" element={<ChangePasswordPage />} />

            <Route path="/map" element={<MapPage />}>
              <Route path="parking/:id" element={<ParkingDetailsPanel />} />
              <Route path="bike/:id" element={<BikeDetailsPanel />} />
              <Route path="bike/:id/edit" element={<BikeEditPanel />} />
            </Route>
            
            <Route path="/rentals" element={<RentalsPage />}>
              <Route path=":id" element={<RentalDetailsPanel />} />
              <Route path=":id/images" element={<RentalImagesPanel />} />
            </Route>

            <Route path="/issues" element={<IssuesPage />}>
              <Route path=":id" element={<IssueDetailsPanel />} />
              <Route path=":id/images" element={<IssueImagesPanel />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
