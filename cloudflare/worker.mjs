const entryURL = "https://raw.githubusercontent.com/myread02/agent-runbook/main/init.md";

export default {
  async fetch(request) {
    if (new URL(request.url).pathname !== "/init") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const upstream = await fetch(entryURL, {
      method: request.method,
      redirect: "error",
    }).catch(() => null);

    if (upstream?.status !== 200) {
      return new Response("Project initialization instructions are temporarily unavailable.", {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
