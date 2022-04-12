import { PrismaClient, Quote, Prisma } from "@prisma/client";
import { nanoid } from "nanoid";

let db: PrismaClient | null = null;

export class QuoteRepository {
  constructor() {
    if (db) return;

    db = new PrismaClient();
  }

  async getQuotes(): Promise<Quote[] | undefined> {
    return db?.quote.findMany();
  }

  async getQuotesByCategory(category: string): Promise<Quote[] | undefined> {
    return db?.quote.findMany({ where: { category } });
  }

  async createQuote(quote: Quote): Promise<Quote | undefined> {
    return db?.quote.create({ data: { ...quote, id: nanoid() } });
  }

  async updateQuote(quote: Partial<Quote>): Promise<Quote | undefined> {
    return db?.quote.update({ where: { id: quote.id }, data: quote });
  }

  async deleteQuote(id: string): Promise<Quote | undefined> {
    return db?.quote.delete({ where: { id } });
  }
}
