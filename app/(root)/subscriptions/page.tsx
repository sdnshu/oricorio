import React from 'react'
import { headers } from "next/headers";
import { unauthorized } from 'next/navigation';

import { eq } from 'drizzle-orm';

import { SubscribeButton } from '@/components/buttons/subscribe'

import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty"

import { subscription, stock } from '@/db/schema';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubscriptionCard } from '@/components/cards/subscription';

const Page = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session?.user) {
        unauthorized()
    }

    const userSubscriptions = await db
        .select({
            subscriptionId: subscription.id,
            frequency: subscription.frequency,
            stockSymbol: stock.symbol,
            stockName: stock.name,
            nextNotification: subscription.nextNotification,
        })
        .from(subscription)
        .innerJoin(stock, eq(subscription.stockId, stock.id))
        .where(eq(subscription.userId, session?.user?.id));

    if (userSubscriptions.length === 0) {
        return (
            <Empty className="border border-dashed">
                <EmptyHeader>
                    <EmptyTitle>No Subscriptions</EmptyTitle>
                    <EmptyDescription>
                        You have no subscriptions. Click the button below to create a new subscription.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    {/* <Button variant="outline" size="sm">
                        New Subscription
                    </Button> */}
                <SubscribeButton />
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <main className='space-y-4'>

            <header className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold'>My Subscriptions</h1>
                <SubscribeButton />
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userSubscriptions.map((sub) => (
                    <SubscriptionCard
                        key={sub.subscriptionId}
                        subscription={{
                            id: sub.subscriptionId,
                            symbol: sub.stockSymbol,
                            name: sub.stockName,
                            interval: sub.frequency,
                            subsequentNotification: sub.nextNotification,
                            status: 'playing',
                        }}
                    />
                ))}
            </section>

        </main>
    )

}

export default Page