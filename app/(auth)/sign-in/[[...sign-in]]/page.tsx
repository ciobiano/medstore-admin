import React from "react";
import SvgBackground from "@/components/svgBackground";
import { SignIn } from "@clerk/nextjs";
import avatar from "@/images/doctor.png";
import Image from "next/image";

export default function Page() {
	return (
		<>
			<SvgBackground>
				<div className="flex justify-center items-center  h-screen">
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
						<div className="flex flex-col justify-center background h-full z-10 my-auto items-center rounded-r-[50px]">
							<div className="w-20 h-20 justify-center items-center border-gray-200 rounded-lg backdrop-blur-sm	bg-white/50">
								<div className="flex justify-center items-center h-full">
									<Image src={avatar} width={60} height={60} alt="Avatar" />
								</div>
							</div>
							<h1 className="text-black text-lg font-bold">Welcome to Finesse Madical Admin! 🎉</h1>
						</div>
					</div>
				</div>
			</SvgBackground>
		</>
	);
}
