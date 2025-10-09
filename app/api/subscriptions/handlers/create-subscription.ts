import { headers } from "next/headers";

import { CronExpressionParser } from 'cron-parser';
import { and, eq } from "drizzle-orm";

import {
    stock as stocksTable,
    subscription as subscriptionsTable
} from "@/db/schema";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

function getNextNotification(frequency: string, fromDate: Date = new Date()): Date {
    const interval = CronExpressionParser.parse(frequency, { currentDate: fromDate });
    return interval.next().toDate();
}

export async function createSubscription(request: Request) {

    try {

        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session || !session.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { stock, frequency } = await request.json();
        if (!stock || !frequency) {
            return new Response("Missing stock symbol or frequency", { status: 400 });
        }

        // Check if stock already exists
        const existingStocks = await db
            .select()
            .from(stocksTable)
            .where(eq(stocksTable.symbol, stock.toUpperCase()));

        let stockId: number;

        if (existingStocks.length > 0) {
            // Stock already exists
            stockId = existingStocks[0].id;
        } else {
            // Fetch from Alpha Vantage
            const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=H07R7B4UH8YDYL6W`;

            const response = await fetch(url);
            if (!response.ok) {
                return new Response("Failed to fetch stock data", { status: 502 });
            }

            const data = await response.json();
            if (!data.Symbol || !data.Name) {
                return new Response("Invalid stock symbol", { status: 400 });
            }

            // Insert stock
            const insertedStock = await db
                .insert(stocksTable)
                .values({
                    symbol: data.Symbol,
                    name: data.Name,
                })
                .returning();

            stockId = insertedStock[0].id;
        }

        // Check if user already subscribed to this stock
        const existingSubscriptions = await db
            .select()
            .from(subscriptionsTable)
            .where(and(
                eq(subscriptionsTable.userId, session.user.id),
                eq(subscriptionsTable.stockId, stockId)
            ));

        if (existingSubscriptions.length > 0) {
            return new Response("Already subscribed to this stock", { status: 409 });
        }

        // Insert subscription
        await db.insert(subscriptionsTable).values({
            userId: session.user.id,
            stockId,
            frequency,
            nextNotification: getNextNotification(frequency),
        });

        return new Response("Subscription created", { status: 201 });

    } catch (error) {

        console.error("Error processing subscription:", error);
        return new Response("Internal Server Error", { status: 500 });

    }

}