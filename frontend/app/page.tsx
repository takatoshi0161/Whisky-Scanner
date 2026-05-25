import { HomeExperience } from "./home-experience";

async function getHealthStatus() {
  return {
    status: "available",
    database: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "configured"
      : "not configured",
  };
}

export default async function HomePage() {
  const health = await getHealthStatus();

  return <HomeExperience health={health} />;
}
