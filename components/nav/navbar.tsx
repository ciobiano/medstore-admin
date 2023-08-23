import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import StoreSwitcher from './store-switch';


const Navbar = async () => {
 const {userId} = auth();
    if (!userId) {
        redirect("/sign-in")
    }


    const store = await prismadb.store.findMany({
        where:{
            userId
        }
    })

    return ( 
        <div className=" border-b">
            <div className="flex items-center h-16 px-4 justify-between">
                {/* Store switcher */}

                <StoreSwitcher items={store} />


        
                <div className="ml-auto flex items-center space-x-4">
                    {/* UserButton */}
                </div>
                </div>


        </div>
     );
}
 
export default Navbar;