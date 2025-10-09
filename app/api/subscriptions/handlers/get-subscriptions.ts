// app/api/subscriptions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscription, user, stock } from "@/db/schema";
import { and, lte, eq } from "drizzle-orm";

export async function getSubscriptions(req: Request) {
    // const searchParams = req.nextUrl.searchParams;
    // const timeParam = searchParams.get("time");

    // if (!timeParam) {
    //     return NextResponse.json({ error: "Missing 'time' query parameter." }, { status: 400 });
    // }

    const date = new Date();

    if (isNaN(date.getTime())) {
        return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
    }

    try {
        const results = await db
            .select({
                id: subscription.id,
                status: subscription.status,
                nextNotification: subscription.nextNotification,
                frequency: subscription.frequency,
                user: {
                    name: user.name,
                    email: user.email,
                },
                stock: {
                    symbol: stock.symbol,
                    name: stock.name,
                },
            })
            .from(subscription)
            .where(
                and(
                    lte(subscription.nextNotification, date),
                    eq(subscription.status, "playing")
                )
            )
            .innerJoin(user, eq(subscription.userId, user.id))
            .innerJoin(stock, eq(subscription.stockId, stock.id));

        // Group by stock symbol + name
        const grouped = results.reduce((acc: Record<string, any>, item) => {
            const stockKey = item.stock.symbol;

            if (!acc[stockKey]) {
                acc[stockKey] = {
                    stock: item.stock,
                    subscriptions: [],
                };
            }

            acc[stockKey].subscriptions.push({
                id: item.id,
                status: item.status,
                nextNotification: item.nextNotification,
                frequency: item.frequency,
                user: item.user,
            });

            return acc;
        }, {});

        return NextResponse.json({ groupedSubscriptions: Object.values(grouped) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
