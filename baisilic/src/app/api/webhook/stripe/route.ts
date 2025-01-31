import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "~/server/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

export async function POST(request: Request) {
    const body = await request.text();
    const signature = (await headers()).get('Stripe-Signature') as string
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const credits = Number(session.metadata?.['credits'])
        const userId = session.client_reference_id
        if (!userId || !credits) {
            return NextResponse.json({ error: 'No user or credits' }, { status: 400 })
        }
        await db.stripeTransaction.create({
            data: {
                userId,
                credits
            }
        }),
            await db.user.update({
                where: {
                    id: userId
                },
                data: {
                    credits: {
                        increment: credits,
                    }
                }
            })
        return NextResponse.json({ message: 'Payment successful' }, { status: 200 })
    }
    return NextResponse.json({})
}