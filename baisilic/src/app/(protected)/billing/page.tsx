'use client'
import { Info } from 'lucide-react'
import React from 'react'
import { Pricing } from '~/components/ui/billing/princing'
import { Button } from '~/components/ui/button'
import { Slider } from '~/components/ui/slider'
import { createCheckoutSession } from '~/lib/stripe'
import { api } from '~/trpc/react'

const Billing = () => {
    const { data: user } = api.project.getMyCredits.useQuery()
    const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100])
    const creditsToBuyAmount = creditsToBuy[0]!
    const price = (creditsToBuyAmount / 50).toFixed(2)

    return (
        <div>
            <h1>Votre solde actuel: {user?.credits}</h1>
            <div className='h-2'></div>
            <div className='bg-emerald-50 px-4 py-2 rounded-md border border-emerald-200 text-emerald-700'>
                <div className='flex items-center gap-2'>
                    <Info className='size-4' />
                    <p className='text-sm'>
                        Chaque token vous permette d'indexer 1 fichier depuis le repository Github.
                    </p>
                    <p className='text-sm text-emerald-400'>
                        Ex. Si votre projet contient 100 fichiers, vous aurez besoin de 100 tokens pour pouvoir l'indexer.
                    </p>
                </div>

            </div>
            <div className='h-4'></div>
            <Slider defaultValue={[100]} max={1000} min={10} onValueChange={value => setCreditsToBuy(value)} value={creditsToBuy} />
            <div className='h-4'></div>
            <Button onClick={() => {
                createCheckoutSession(creditsToBuyAmount)
            }}>
                Acheter {creditsToBuyAmount} tokens pour {price}€
            </Button>
            {/* <Pricing /> */}
        </div>
    )
}

export default Billing