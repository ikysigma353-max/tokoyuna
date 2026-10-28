import { getStore } from "@netlify/blobs";

export default async (request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { game, playerId, product, price } = body;

      if (
        typeof game !== "string" ||
        typeof playerId !== "string" ||
        typeof product !== "string" ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
      ) {
        return Response.json(
          { error: "Data pesanan tidak valid" },
          { status: 400, headers }
        );
      }

      const store = getStore("tokoyuna-orders");
      const id = crypto.randomUUID();
      const order = {
        id,
        game,
        playerId,
        product,
        price: Number(price),
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      await store.setJSON(id, order);

      return Response.json(
        { success: true, order },
        { status: 201, headers }
      );
    } catch {
      return Response.json(
        { error: "Permintaan tidak valid" },
        { status: 400, headers }
      );
    }
  }

  if (request.method === "GET") {
    const token = Netlify.env.get("TOKOYUNA_ADMIN_TOKEN");
    if (
      !token ||
      request.headers.get("Authorization") !== `Bearer ${token}`
    ) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    const store = getStore("tokoyuna-orders");
    const { blobs } = await store.list();
    const orders = await Promise.all(
      blobs.map(({ key }) => store.get(key, { type: "json" }))
    );

    return Response.json({ orders }, { headers });
  }

  return Response.json(
    { error: "Method not allowed" },
    { status: 405, headers }
  );
};
