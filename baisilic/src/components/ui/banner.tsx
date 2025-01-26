import { XMarkIcon } from '@heroicons/react/20/solid'

export default function Banner() {
    return (
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm/6 text-emerald-900">
                    <strong className="font-semibold">Obtenez plus de token</strong>
                    <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
                        <circle r={1} cx={1} cy={1} />
                    </svg>
                    Join us in Denver from June 7 – 9 to see what’s coming next.
                </p>
                <a
                    href="#"
                    className="flex-none rounded-full bg-emerald-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                    Register now <span aria-hidden="true">&rarr;</span>
                </a>
            </div>
            <div className="flex flex-1 justify-end">
                <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon aria-hidden="true" className="size-5 text-gray-900" />
                </button>
            </div>
        </div>
    )
}
