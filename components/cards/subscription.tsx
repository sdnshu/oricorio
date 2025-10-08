import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import {
    Info,
    Trash2
} from 'lucide-react';

type Props = {
    subscription: {
        id: number;
        symbol: string;
        name: string;
        interval: string;
        status: 'playing' | 'paused';
        firstNotification?: string;
        subsequentNotification?: string;
        uuid?: string;
    };
}

const SubscriptionCard = ({ subscription }: Props) => {

    return (
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 p-4 h-full">

            <div className="flex items-center justify-between mb-4">
                <div className='flex flex-col justify-center'>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{subscription.symbol}</h2>
                    <h4 className='text-xs font-medium'>{subscription.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                    {subscription?.status === 'paused' && (
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200">Paused</span>
                    )}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="p-1 h-8 w-8 rounded-full"
                    >
                        <Info />
                    </Button>
                    {/* <Modal
                        title="Unsubscribe from stock"
                        description="If you unsubscribe, you will no longer receive price notifications of stock."
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-1 h-8 w-8 rounded-full hover:bg-red-400 hover:text-white cursor-pointer"
                            >
                                <Trash2 />
                            </Button>
                        }
                        content={
                            <UnsubscriptionForm
                                stock={subscription.name}
                                uuid={subscription.uuid}
                            />
                        }
                    /> */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-1 h-8 w-8 rounded-full hover:bg-red-400 hover:text-white cursor-pointer"
                    >
                        <Trash2 />
                    </Button>
                </div>
            </div>

            {subscription?.status === 'playing' && (
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Next Notification :</span>
                        <span>{subscription.subsequentNotification}</span>
                    </div>

                </div>
            )}

            {subscription?.status === 'paused' && (
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Resumes From :</span>
                        <span>{subscription.firstNotification}</span>
                    </div>
                </div>
            )}

            <Link href={`/subscriptions/${subscription.uuid}`} className="cursor-pointer grid col-span-1">
                <Button variant="outline" className="cursor-pointer">
                    Manage Subscription
                </Button>
            </Link>

        </section>
    );
};

export { SubscriptionCard }