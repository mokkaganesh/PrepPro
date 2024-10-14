"use client";
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from "next/link";

function Header() {

const path=usePathname();  //next hook
useEffect(() => {
    console.log(path);
}
, []);

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md bg-opacity-100 bg-stone-800'>
        <Image src="/logo2.svg" alt="logo" width={150} height={100}  />
        <ul className='hidden md:flex gap-6'>
           <Link href={`/dashboard`}><li className={`hover: text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard' && 'text-primary font-bold'}`}>Dashboard</li> </Link>
            <li className={`hover: text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
            <Link href={`/dashboard/matchedskills`}><li className={`hover: text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/matchedskills' && 'text-primary font-bold'}`}>Skills</li></Link>
            <li className={`hover: text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/how' && 'text-primary font-bold'}`}>How it Works</li>
            <Link href={`/compiler`}><li className={`hover: text-primary hover:font-bold transition-all cursor-pointer ${path=='/compiler' && 'text-primary font-bold'}`}>CodeLab</li></Link>
        </ul>
        <UserButton/>
    </div>  
  )
}

export default Header