import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {auth, signOut, signIn} from '@/auth'
import { redirect } from 'next/dist/server/api-utils'

const Navbar = async() => {
    const session  = await auth() 
  return (
    <header className='px-5 py-3 bg-white shadow-sm font-work-sans'>
        <nav className='flex justify-between items-center'>
            <Link href="/">
                <Image src="/realdisruptor_logo.jpg" alt="logo" width={50} height={50} />
            </Link>

            <div className='flex items-center gap-5 text-black'>
                {session && session?.user ? (
                    <>
                        <Link href = "/ideas/create">
                            <span>Create</span>
                        </Link>

                        <form action={async () => {

                            "use server";;
                            await signOut({redirectTo: "/"});
                          }}>
                            <button type='submit'>Log Out</button>
                        </form>

                        <Link href = {"/profile/${session?.id"}>
                            <span>{session?.user?.name}</span>
                        </Link>
                    </>
                    ) : (

                    <form action={async () => {

                        "use server";
                        await signIn('github');
                    }}>
                        <button type="submit">Login</button>
                        </form>
                    )}

            </div>

        </nav>

        

    </header>

  )
}

export default Navbar
