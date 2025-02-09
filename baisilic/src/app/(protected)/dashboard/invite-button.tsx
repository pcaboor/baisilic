'use client'

import { Plus, UserPlus, UserPlus2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import useProject from '~/hooks/use-project'

const InviteButton = () => {
    const { projectId } = useProject()
    const [open, setOpen] = React.useState(false)
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inviter des collaborateurs</DialogTitle>
                        <p className='text-sm text-gray-500'>
                            Envoyez leur ce lien d'invitation
                        </p>
                        <Input readOnly className='m-4' onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
                            toast.success("Invitation copiée avec succès !")
                        }}
                            value={`${window.location.origin}/join/${projectId}`}
                        />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Button onClick={() => { setOpen(true) }} className='bg-white hover:bg-neutral-100 shadow-none text-neutral-500 text-base'>
                <Plus
                    size={17}
                    className="rounded transition-all duration-200 ease-in-out hover:bg-neutral-100 hover:scale-110"
                />
                Inviter des collaborateurs
            </Button>


        </>
    )
}

export default InviteButton