import { useUser } from "@clerk/nextjs";

type Role = "user" | "admin" | "editor";

export function useRole() {
  const { user } = useUser();
  
  // In a real app, this would come from your database
  // For now, we'll simulate roles based on email
  const role: Role = user?.emailAddresses[0]?.emailAddress.includes("admin") 
    ? "admin" 
    : user?.emailAddresses[0]?.emailAddress.includes("editor")
    ? "editor"
    : "user";

  return { role };
}