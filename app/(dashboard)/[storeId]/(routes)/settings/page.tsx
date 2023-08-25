import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
	params: {
		storeId: string;
	};
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
	const { userId } = auth();
	if (!userId) {
		redirect("/sign-in");
	}

	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			userId,
		},
	});

    if(!store){
        redirect(`/`)
    }

	return (
		<div className="flex justify-center items-center mx-auto h-fit mt-6 ">
			<div className="p-8 space-y-4 my-auto w-full overflow-y-hidden   lg:w-3/5">
				<SettingsForm storeData={store} />
			</div>
		</div>
	);
};

export default SettingsPage;
