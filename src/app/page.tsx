export default async function Home() {
  let data = await fetch(process.env.API_BASE_URL + "/home");
  let results = await data.json();
  console.log(results);

  return <div>Home</div>;
}
