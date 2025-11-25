import Image from 'next/image'
import Link from 'next/link'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { AuthButton } from '@/modules/auth/ui/components/auth-button'

import { SearchInput } from './search-input'

export const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center bg-white px-2 pr-5">
      <div className="flex w-full items-center gap-4">
        {/* Menu and logo */}
        <div className="flex flex-shrink-0 items-center">
          <SidebarTrigger />
          <Link href="/" className="hidden md:block">
            <div className="flex items-center gap-1 p-4">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">NewTube</p>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mx-auto flex max-w-[700px] flex-1 justify-center">
          <SearchInput />
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-4">
        <AuthButton />
      </div>
    </nav>
  )
}
