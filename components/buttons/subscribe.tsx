"use client"

import React from 'react'

import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SubscribeForm } from '@/components/forms/subscribe'
import { Modal } from '@/components/wrappers/modal'

const SubscribeButton = () => {
    return (
        <Modal
            title='Subscribe to a stock'
            description='Add subscription to get notified about price changes'
            content={(handleClose) => <SubscribeForm onClose={handleClose} />}
        >
            <Button><Plus />Add Subscription</Button>

        </Modal>
    )
}

export { SubscribeButton }