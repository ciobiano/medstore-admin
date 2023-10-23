import React from "react";
import SvgBackground from "@/components/svgBackground";
import { SignIn } from "@clerk/nextjs";
import avatar from "@/images/doctor.png";
import Image from "next/image";

export default function Page() {
	return (
		<>
			<div className="grid grid-cols-2  max-w-fit mx-auto">
				<div className="flex flex-col justify-center items-center">
					<SignIn
						appearance={{
							elements: {
								card: {
									marginRight: "0",
									borderRadius: "0px",
									borderTopLeftRadius: "50px",
									borderBottomLeftRadius: "50px",
								},
							},
						}}
					/>
				</div>
				<div className="flex flex-col justify-center background h-full backdrop-blur-lg my-auto items-center rounded-r-[50px]"></div>
			</div>
		</>
	);
}
