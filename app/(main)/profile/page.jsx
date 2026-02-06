import { getUserProfile, getUserStats } from "@/actions/user";
import { ProfileContent } from "./_components/profile-content";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Profile | Vehiql",
  description: "Manage your Vehiql profile and preferences",
};

export default async function ProfilePage() {
  const [profileResult, statsResult] = await Promise.all([
    getUserProfile(),
    getUserStats(),
  ]);

  if (!profileResult.success) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-6 gradient-title">My Profile</h1>
      <ProfileContent
        profile={profileResult.data}
        stats={statsResult.success ? statsResult.data : null}
      />
    </div>
  );
}
