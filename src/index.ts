import { Quote } from "@prisma/client";
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { QuoteRepository } from "./repo/quote";

const server: FastifyInstance = Fastify({});

const quoteRepo = new QuoteRepository();

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

server.get("/ping", opts, async (request, reply) => {
  return { pong: "it worked!" };
});

server.get("/", async (request, reply) => {
  return "You have reach All in Quote!";
});

server.get("/quotes", async (request, reply) => {
  return {
    status: 200,
    success: true,
    data: await quoteRepo.getQuotes(),
  };
});

server.get("/quotes/:category", async (request, reply) => {
  console.log(request.params);

  if (!request.params) {
    return await quoteRepo.getQuotes();
  }

  const { category } = request.params as { category: string };

  if (!category || category === "") {
    return await quoteRepo.getQuotes();
  }

  return {
    status: 200,
    success: true,
    data: await quoteRepo.getQuotesByCategory(category),
  };
});

server.post("/quote", async (request, reply) => {
  console.log(request.body);

  const quote = request.body as Quote;

  if (!quote.author) {
    reply.code(400);
    return "author field missing";
  }

  if (!quote.text) {
    reply.code(400);
    return "text field missing";
  }

  if (!quote.category) {
    reply.code(400);
    return "category field missing";
  }

  return {
    status: 200,
    success: true,
    data: await quoteRepo.createQuote(quote),
  };
});

server.put("/quote", async (request, reply) => {
  console.log(request.body);

  const quote = request.body as Quote;

  return {
    status: 200,
    success: true,
    data: await quoteRepo.updateQuote(quote),
  };
});

server.delete("/quote/:id", async (request, reply) => {
  console.log(request.params);

  if (!request.params) {
    return await quoteRepo.getQuotes();
  }

  const { id } = request.params as { id: string };

  if (!id || id === "") {
    return {
      status: 400,
      success: false,
    };
  }

  await quoteRepo.deleteQuote(id);

  return { status: 200, success: true };
});

const start = async () => {
  try {
    await server.listen(process.env.PORT || 3000);

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`running at port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
