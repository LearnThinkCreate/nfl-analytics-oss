import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the QB page by default
  redirect("/qb")
}

