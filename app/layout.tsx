import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ModalProvider from "@/provider/modal-provider";
import { ToastProvider } from "@/provider/toast-provider";
import { ThemeProvider } from "@/components/modal/Theme-provider";
import { DesktopContent } from "@/components/desktop-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Finesse Med-store",
	description: "A CMS for Finesse Med-store",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ToastProvider />
						<ModalProvider />
						<DesktopContent>{children}</DesktopContent>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
