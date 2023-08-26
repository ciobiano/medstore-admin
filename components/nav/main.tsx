"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
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
    {
        href: `/${params.storeId}/billboards`,
        label: "Billboards",
        active: pathname === `/${params.storeId}/billboards`

    },
  ]

    return (
			<nav
				className={cn("items-center flex space-x-4 lg:space-x-6", className)}
			>
				{routes.map((routes) => (
					<Link
						href={routes.href}
						key={routes.href}
						className={cn(
							"text-sm font-medium transition-colors  hover:text-black dark:hover:text-grey-300",
							routes.active
								? "text-black dark:text-white"
								: "text-muted-foreground",
							className
						)}
					>
						{routes.label}
					</Link>
				))}
			</nav>
		);
}