import { Copy, Globe } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import Heading from "./header";
import { Separator } from "./separator";
import { Button } from "./button";
import toast from "react-hot-toast";


interface ApiClipProps {
	title: string;
	description: string;
	variant: "Public" | "Private";
}

const textMap: Record<ApiClipProps["variant"], string> = {
	Public: "Public",
	Private: "Private",
};

const variantMap: Record<ApiClipProps["variant"], BadgeProps["variant"]> = {
	Public: "secondary",
	Private: "destructive",
};

export const ApiClip: React.FC<ApiClipProps> = ({ title, description, variant="Public" }) => {
        
    const onCopy = () =>{
        navigator.clipboard.writeText(description)
        toast.success("Copied to clipboard")
    }

    return (
        <Alert>
			<Globe className="h-4 w-4" />
			<AlertTitle className="flex items-center gap-x-3">
				{title}
				<Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
			</AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.3rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant='outline' size='icon' onClick={onCopy}>
                    <Copy className="h-4 w-4"/>
                </Button>

            </AlertDescription>
		</Alert>
    );
}