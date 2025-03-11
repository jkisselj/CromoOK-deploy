import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function LogoutButton() {
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
