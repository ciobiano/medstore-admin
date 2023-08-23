import prismadb from "@/lib/prismadb";

interface DashboardLayoutProps {
params: {storeId: string}
}
const DashboardLayout: React.FC<DashboardLayoutProps> = async ({
  params
}) => {

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId
    }
  })
  return ( 
    <>
    Dashboard: {store?.name}
    </>
   );
}
 
export default DashboardLayout;
