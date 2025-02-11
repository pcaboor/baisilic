'use client'

import React, { useState } from 'react'
import { Avatar, AvatarImage } from '../avatar';
import { Bars3Icon } from '@heroicons/react/20/solid';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '../button';


const navigation = [
    { name: "Apprendre Singulary", href: "/docs" },
    { name: "Features", href: "#" },
];

const NavBar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isSignedIn } = useUser(); // Récupérer l'état de connexion
    return (
        <div >
            <header className="absolute inset-x-0 z-50 bg-white">
                <nav
                    className="flex justify-between p-3 lg:px-8"
                >
                    <div className="flex lg:flex-1 text-2xl font-medium items-center gap-3">
                        <a href="/" className="-m-1.5 p-1.5">
                            <Avatar className="h-12 w-12 mx-auto">
                                <AvatarImage
                                    sizes="xl"
                                    src="https://i.pinimg.com/736x/56/71/b8/5671b84e3f89c1f1eb3fbb6ed507b47a.jpg"
                                />
                            </Avatar>
                        </a>
                        Singulary
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
                    <div className="hidden lg:flex lg:gap-x-12 items-center">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-base font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    {/* Vérification de la connexion pour afficher le bon bouton */}
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
                        {isSignedIn ? (
                            <UserButton />
                        ) : (
                            <SignInButton>
                                <Button>

                                    S'inscrire / Se connecter

                                </Button>
                            </SignInButton>
                        )}
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default NavBar