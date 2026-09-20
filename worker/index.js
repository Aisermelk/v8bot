export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =====================================================
    // GET /webhook
    // Verificação do Webhook pela Meta
    // =====================================================
    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (
        mode === "subscribe" &&
        token === env.WHATSAPP_VERIFY_TOKEN
      ) {
        return new Response(challenge, {
          status: 200,
          headers: {
            "Content-Type": "text/plain"
          }
        });
      }

      return new Response("Token inválido", {
        status: 403
      });
    }

    // =====================================================
    // POST /webhook
    // Recebe eventos enviados pela Meta
    // =====================================================
    if (request.method === "POST" && url.pathname === "/webhook") {
      try {
        const body = await request.json();

        console.log(
          "Webhook WhatsApp recebido:",
          JSON.stringify(body)
        );

        return new Response("EVENT_RECEIVED", {
          status: 200
        });
      } catch (error) {
        console.error("Erro ao processar webhook:", error);

        return new Response("Bad Request", {
          status: 400
        });
      }
    }

    // =====================================================
    // Rota principal
    // =====================================================
    return new Response("V8Bot WhatsApp Webhook funcionando", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      }
    });
  }
};
