export async function POST(req) {
  try {
    const { url } = await req.json();
    const apiKey = "76a953d77196db7bf587d2154cc95ccb";

    const formData = new URLSearchParams();
    formData.append('api_token', apiKey);
    formData.append('url', url);
    formData.append('return', 'apple_music,spotify,youtube,deezer');

    const auddRes = await fetch("https://api.audd.io/", {
      method: "POST",
      body: formData,
    });

    const data = await auddRes.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
}
