'use client'

import React from 'react';

import cronstrue from 'cronstrue';
import { useFormik } from 'formik'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// import { useSession } from '@/lib/auth-client';

type Props = {
    onClose: () => void;
};

const SubscribeForm = ({ onClose }: Props) => {

    // const {
    //     data: session,
    //     isPending, 
    //     error, 
    //     refetch 
    // } = useSession()

    const formik = useFormik({

        initialValues: {
            stock: '',
            frequency: ["*", "*", "*", "*", "*"],
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            await formik.validateForm()
            if (!formik.isValid) {
                toast.error("Try entering some real values");
                setSubmitting(false)
                return
            }

            try {

                const data = {
                    // userId: session?.user?.id,
                    stock: formik.values.stock,
                    frequency: formik.values.frequency.join(" ").trim()
                }

                const response = await fetch('/api/subscriptions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    toast.success("Subscribed successfully!");
                    formik.resetForm()
                    onClose()
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message || "Subscription failed");
                }

            } catch (error) { console.error("error") }

            finally { setSubmitting(false) }

        }

    })

    const fullCron = formik.values.frequency.join(" ").trim();
    const humanReadable = cronstrue.toString(fullCron, {
        throwExceptionOnParseError: false,
    });

    return (
        <form className="space-y-4" onSubmit={formik.handleSubmit}>

            <div className="flex flex-col space-y-2">

                <Label className="pl-2">Stock Name</Label>

                <Input
                    id='stock'
                    name="stock"
                    type="text"
                    placeholder="Enter stock name"
                    required
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />

                {formik.touched.stock && formik.errors.stock && (
                    <div className="text-red-500 px-2">{formik.errors.stock}</div>
                )}

            </div>

            <div className="flex flex-col space-y-2">

                <Label className="pl-2">Frequency (Cron Expression)</Label>

                <div className="w-full grid grid-cols-5 gap-2">
                    {["Min", "Hr", "Day", "Month", "Weekday"].map((label, idx) => (
                        <Input
                            key={idx}
                            id={`frequency[${idx}]`}
                            name={`frequency[${idx}]`}
                            type="text"
                            placeholder="*"
                            value={formik.values.frequency[idx]}
                            onChange={(e) => {
                                const newFrequency = [...formik.values.frequency];
                                newFrequency[idx] = e.target.value;
                                formik.setFieldValue("frequency", newFrequency);
                            }}
                        />
                    ))}
                </div>

                {fullCron && (
                    <div className="text-sm text-muted-foreground pl-2">{humanReadable}</div>
                )}

                {formik.touched.frequency && formik.errors.frequency && (
                    <div className="text-red-500 px-2">{formik.errors.frequency}</div>
                )}

            </div>

            <Button
                type="submit"
                className='w-full cursor-pointer'
                disabled={formik.isSubmitting}
            >
                {formik.isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" />
                        <span>Subscribing...</span>
                    </>
                ) : 'Subscribe'}
            </Button>

        </form>
    );
};

export { SubscribeForm };