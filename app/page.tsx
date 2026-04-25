import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 flex-col">
        {/* Display hero section for unauthenticated visitors */}
        <HeroSection />
      </main>
    </div>
  );
}
