"use client"

import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle, ShoppingBagIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { useState } from "react";
import { useModalDialog } from '@/hooks/use-modal-dialog';


type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;


interface storeSwitchProps extends PopoverTriggerProps {
    items: Store[];
}



export default function StoreSwitcher({
    items,
    className

}: storeSwitchProps) {

    const  ModalDialog = useModalDialog()
    const params = useParams()
    
    const router = useRouter()


    const [open, setOpen] = useState(false)

    const formattedStore = items.map((store) => ({
        label: store.name,
        value: store.id,
    }));

    const currentStore = formattedStore.find(
        (store) => store.value === params.storeId
    );

    const onStoreSelect = (store: { label: string; value: string }) => {
			setOpen(false);
			router.push(`/${store.value}`);
		};


  return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					role="combobox"
					aria-expanded={open}
					aria-label="select store"
					className={cn("w-[200px]", className)}
				>
					<ShoppingBagIcon size={15} className="mr-2" />
					{currentStore?.label || "select store"}
					<ChevronsUpDown className="h-4 w-4 ml-auto shrink-0 opacity-50 " />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="search store" />
						<CommandEmpty>No Store Found</CommandEmpty>
                        <CommandGroup>
                            {formattedStore.map((store)=>(
                                <CommandItem
                                onSelect={() => onStoreSelect(store)}
                                key={store.value}
                                className="text-sm"
                                >
                                    <ShoppingBagIcon className="mr-2 h-4 w-4"/>
                                    {store.label}
                                    <Check className={cn('h-4 w-4 ml-auto ',
                                    currentStore?.value === store.value ? 'opacity-100' :
                                    "opacity-0"
                                    )}/>

                                </CommandItem>
                            ))}
                            </CommandGroup>
					</CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                            onSelect={()=>{
                                setOpen(false)
                                ModalDialog.onOpen()
                            }}
                            >
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Create store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>

				</Command>
			</PopoverContent>
		</Popover>
	);
}
