import {
    Geist,
    Geist_Mono,
    Kelly_Slab
  } from "next/font/google"
  
  import { cn } from "@/lib/utils"
  
  const fontSans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
  })
  
  const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
  })
  
  const fontKellySlab = Kelly_Slab({
    subsets: ["latin"],
    variable: "--font-kelly-slab",
    weight: "400",
  })
  
  export const fontVariables = cn(
    fontSans.variable,
    fontMono.variable,
    fontKellySlab.variable
  )