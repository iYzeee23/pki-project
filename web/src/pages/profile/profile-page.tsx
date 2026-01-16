import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";

export function ProfilePage() {
  const me = useAuthStore((s) => s.me);

  if (!me) return null;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h2>Profile</h2>

      <div><b>Username:</b> {me.username}</div>
      <div><b>First name:</b> {me.firstName}</div>
      <div><b>Last name:</b> {me.lastName}</div>
      <div><b>Phone:</b> {me.phone}</div>
      <div><b>Email:</b> {me.email}</div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <Link to="/profile/edit">Edit profile</Link>
        <Link to="/profile/password">Change password</Link>
      </div>
    </div>
  );
}
