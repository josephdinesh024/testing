let clients = [];

export async function GET(req) {
  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const client = {
          send: (data) =>
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            ),
        };

        clients.push(client);

        // Initial hello message
        client.send({ type: "connected", message: "SSE connection established" });

        // Keep alive ping every 15s
        const interval = setInterval(() => {
          controller.enqueue(new TextEncoder().encode(`: ping\n\n`));
        }, 15000);

        // Cleanup when client disconnects
        req.signal.addEventListener("abort", () => {
          clearInterval(interval);
          clients = clients.filter((c) => c !== client);
        });
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}

export function broadcastMessage(data) {
  clients.forEach((client) => client.send(data));
}
