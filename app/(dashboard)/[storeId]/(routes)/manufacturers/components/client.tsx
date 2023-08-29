'use client'

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/header";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';
import { ManufacturerColumn, columns } from "./column";
import { ManufacturerModal } from './manufacturer-modal';
import { useState } from "react";


interface ManufacturerClientProps {

	data: ManufacturerColumn[];
}

const ManufacturerClient: React.FC<ManufacturerClientProps> = ({ data }) => {

	 const [isModalOpen, setIsModalOpen] = useState(false);

		const openModal = () => {
			setIsModalOpen(true);
		};

		const closeModal = () => {
			setIsModalOpen(false);
		};
	return (
		<>
			
			<div className="flex items-center justify-between">
				<Heading
					title={`Manufacturer(${data.length})`}
					description="List of all manufacturer."
				/>
				<Button onClick={openModal}>
					<Plus className="h-4 w-4" />
					Add new
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="this is an API list for routes" />
			<Separator />
			<ApiList entityIdName="manufacturerId" entityName="manufacturers" />
			<ManufacturerModal isOpen={isModalOpen} onClose={closeModal} ManufacturerData={null} mode="create" />
		</>
	);
};

export default ManufacturerClient;
