import { HomeExperience } from "./home-experience";

async function getHealthStatus() {
  const apiBaseUrl =
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://backend:8000";

  try {
    const response = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { status: "unavailable", database: "unknown" };
    }

    return response.json();
  } catch {
    return { status: "unavailable", database: "unknown" };
  }
}

export default async function HomePage() {
  const health = await getHealthStatus();

  return <HomeExperience health={health} />;
}
