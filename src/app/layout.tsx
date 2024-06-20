import localFont from "next/font/local";
import type { Metadata } from "next";

import "./globals.css";
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const PoppinsMedium = localFont({ src: "../../public/fonts/Poppins-Medium.ttf" })


import CurrentChatProvider from "@/components/contexts/CurrentChatProvider";
import WebsocketProvider from "@/components/contexts/WebsocketProvider";

import { Toaster } from "ui/Toaster"


export const metadata: Metadata = {
  title: "Chat App",
  description: "a chat-app created by mobin taataghi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background antialiased",
					PoppinsMedium.className
				)}
			>
				<CurrentChatProvider>
					<WebsocketProvider>
						{children}
					</WebsocketProvider>
				</CurrentChatProvider>
				<Toaster />
			</body>
		</html>
	);
}
