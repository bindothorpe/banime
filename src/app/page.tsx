import { HomeResponse } from "@/types/home-response";

export default async function Home() {
  const data = await fetch(process.env.API_BASE_URL + "/home");
  const results: HomeResponse = await data.json();
  console.log(results);

  return <div>Home</div>;
}
