import { useParams, usePathname } from "next/navigation"


export function MainNav({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>){

    const pathname = usePathname()
    const params = useParams()

  const routes = [
    {
        href: `/${params.storeId}`,
        label: "Dashboard",
        active: pathname === `/${params.storeId}`

    },
    {
        href: `/${params.storeId}/settings`,
        label: "Settings",
        active: pathname === `/${params.storeId}/settings`

    },
  ]

    return(
        <div>
            <h1>Nav</h1>
        </div>
    )
}