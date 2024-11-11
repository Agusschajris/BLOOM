export async function GET() {
  const initResponse = await fetch("https://archive.ics.uci.edu/api/datasets/list?filter=python", {
    method: "GET",
  })

  if (!initResponse.ok) {
    console.error("Error fetching datasets");
    return new Response("[]", { status: 500 });
  }

  const meta = await initResponse.json();


  const datasets = (meta.data as any[]).map(dataset => ({
    name: dataset.name,
    link: (new URL(`https://archive.ics.uci.edu/dataset/${dataset.id}`))
  }));

  return new Response(JSON.stringify(datasets), { status: 200 });
}