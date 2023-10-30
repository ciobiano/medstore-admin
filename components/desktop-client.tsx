"use client";

import { useClient } from "@/hooks/use-client";

export function DesktopContent({ children }: { children: React.ReactNode }) {
	const client = useClient();

	return (
		<>
			{client && (
				<>
                <div className="mobile-restriction flex flex-col h-screen   lg:hidden">
                    <p> Sorry 😢 <br /> This dashboard Can&apos;t view on mobile devices</p>
                <h3 className=" mt-8 text-lg font-bold justify-center "> Desktop view Only !</h3>
                </div>
                </>
			)}
			<div className="desktop-content">{children}</div>
			<style jsx>{`
				.mobile-restriction {
					text-align: center;
					justify-content: center;
					align-items: center;
					padding: 1rem;
				}

				.mobile-restriction p {
					font-size: 1.5rem;
					font-weight: bold;
				}

				@media (max-width: 1024px) {
					.desktop-content {
						display: none;
					}

					.mobile-restriction {
						display: flex;
					}
				}
			`}</style>
		</>
	);
}
