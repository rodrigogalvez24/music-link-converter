let songs = {};

function generateId(length = 7) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < length; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export async function POST(req) {
  const body = await req.json();
  const id = generateId();
  songs[id] = body;
  return Response.json({ id });
}

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id || !songs[id]) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(songs[id]);
}
