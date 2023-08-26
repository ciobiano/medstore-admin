"use client";
import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiClip } from "./api-clip";

interface ApiListProps {
	entityName: string;
	entityIdName: string;
}
export const ApiList: React.FC<ApiListProps> = ({
	entityName,
	entityIdName,
}) => {
	const params = useParams();
	const origin = useOrigin();
	const baseUrl = `${origin}/api/${params.storeId}`;
	return (
		<>
			<ApiClip
				title="GET"
				description={`${baseUrl}/${entityName}`}
				variant="Public"
			/>
			<ApiClip
				title="GET"
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
				variant="Public"
			/>
			<ApiClip
				title="POST"
				description={`${baseUrl}/${entityName}`}
				variant="Private"
			/>
			<ApiClip
				title="PATCH"
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
				variant="Private"
			/>
			<ApiClip
				title="DELETE"
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
				variant="Private"
			/>
		</>
	);
};
