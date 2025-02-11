"use client"

import { Info } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Slider } from '~/components/ui/slider'
import { createCheckoutSession } from '~/lib/stripe'

import { api } from '~/trpc/react'

const Billing = () => {
    const { data: user } = api.project.getMyCredits.useQuery()
    const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100])
    const creditsToBuyAmount = creditsToBuy[0]!
    const price = (creditsToBuyAmount / 50).toFixed(2)

    const handleCheckout = async (amount: number) => {
        try {
            await createCheckoutSession(amount)
        } catch (error) {
            console.error('Error creating checkout session:', error)
        }
    }

    return (
        <div className="w-full max-w-4xl">

            <Card className="shadow-none border-none">
                <CardHeader>
                    <h1 className="text-3xl font-semibold text-neutral-600">
                        Avancez à votre rythme
                    </h1>
                    <p className="text-sm text-neutral-400">
                        Peut importe la taille de votre projet, payez en fonction de vos besoins. Les tokens sont partagés entre tous les projets.
                    </p>
                    <div className='h-4'></div>
                    <CardTitle className="text-2xl font-semibold text-neutral-700">

                        Gestion des crédits
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-neutral-600">
                                Votre solde actuel
                            </h2>
                            <span className="text-2xl font-bold text-neutral-800">
                                {user?.credits || 0} tokens
                            </span>
                        </div>

                        <div className="bg-muted px-4 py-3 rounded-lg borde">
                            <div className="flex items-start gap-3">
                                <Info className="size-5 text-neutral-600 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm text-neutral-600">
                                        Chaque token vous permet d'indexer 1 fichier depuis le repository Github.
                                    </p>
                                    <p className="text-sm text-neutral-600">
                                        Ex. Si votre projet contient 100 fichiers, vous aurez besoin de 100 tokens pour pouvoir l'indexer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-600 mb-2">
                                Sélectionnez le nombre de tokens à acheter : {creditsToBuyAmount}
                            </label>
                            <Slider
                                defaultValue={[100]}
                                max={1000}
                                min={10}
                                onValueChange={value => setCreditsToBuy(value)}
                                value={creditsToBuy}
                            />
                        </div>

                        <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-neutral-600">Total à payer</p>
                                <p className="text-2xl font-bold text-neutral-800">{price}€</p>
                            </div>
                            <Button
                                size="lg"
                                onClick={() => handleCheckout(creditsToBuyAmount)}
                                className="min-w-[200px]"
                            >
                                Acheter {creditsToBuyAmount} tokens
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Billing