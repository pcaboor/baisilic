'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { PreviewGradient } from '~/components/ui/bento-landing-page'
import Banner from '~/components/ui/banner'
import { DisplayCard } from '~/components/ui/landing-page/cards'
import { SignIn, UserButton } from '@clerk/nextjs'
import { Gooey } from '~/components/ui/landing-page/hero'
import useProject from '~/hooks/use-project'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const { project } = useProject()
  const router = useRouter()

  const handleGetStarted = () => {
    if (project?.id) {
      router.push(`/${project.id}`)
    } else {
      setIsCreateProjectOpen(true)
    }
  }

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">ToucaML</span>
              <img src="toucaml.png" className="h-10" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            Log in
          </div>
        </nav>
      </header>
      <div className="relative isolate px-6">
        <div className="mx-auto max-w-2xl py-32 lg:py-48 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-emerald-900 sm:text-7xl">
            Develop your IT project faster
          </h1>
          <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleGetStarted}
              className="rounded-md bg-emerald-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
            >
              Get started
            </button>
            <a href="#" className="text-sm font-semibold text-gray-900">Learn more →</a>
          </div>
        </div>
        <Gooey />
      </div>
      <PreviewGradient />
      <Dialog open={isCreateProjectOpen} onClose={setIsCreateProjectOpen}>
        <DialogPanel className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Create a new project</h2>
            <p className="text-gray-600 mt-2">You don’t have any projects yet. Create one to get started.</p>
            <button
              onClick={() => setIsCreateProjectOpen(false)}
              className="mt-4 px-4 py-2 bg-emerald-900 text-white rounded-md hover:bg-indigo-500"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  )
}
