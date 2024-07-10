import localFont from "next/font/local";
import type { Metadata } from "next";

import "./globals.css";
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const PoppinsMedium = localFont({ src: "../../public/fonts/Poppins-Medium.ttf" })


import CurrentChatStatusProvider from "@/components/contexts/CurrentChatStatusProvider";
import WebsocketProvider from "@/components/contexts/WebsocketProvider";
import AllChatsAndInboxesProvider from "@/components/contexts/AllChatsAndInboxesProvider";

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
				<CurrentChatStatusProvider>
					<WebsocketProvider>
						<AllChatsAndInboxesProvider>
							{children}
						</AllChatsAndInboxesProvider>
					</WebsocketProvider>
				</CurrentChatStatusProvider>
				<Toaster />
			</body>
		</html>
	);
}
