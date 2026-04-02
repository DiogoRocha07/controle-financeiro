'use client'

export default function Button({children}: {children: React.ReactNode}){
    return (
        <button className="flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none cursor-pointer">{children}</button>
    )
}