import { createBrowserRouter } from "react-router-dom";

import LoginForm from "../../features/login or register form/components/LoginForm";
import RegisterForm from "../../features/login or register form/components/RegisterForm";
import ChatInterface from "../../features/chat interface/components/ChatInterface";

import AllRooms from "../../features/all rooms/components/AllRooms";
import Search from "../../features/search/components/Search";
import Options from "../../features/options/components/Options";

import MainLayout from "../layouts/MainLayout";





export const router = createBrowserRouter([
	{
		path: "/",
		element: <RegisterForm />,
	},
	{
		path: "/login",
		element: <LoginForm />,
	},
	{
		path: "/rooms",
		element: <MainLayout />,
		errorElement: <h1 style={{textAlign:"center"}}>برگرد عقب داداش برگرد عقب</h1>,
		children: [
			{
				path: "/rooms",
				element: <AllRooms />
			},
			{
				path: "/rooms/search",
				element: <Search />
			},
			{
				path: "/rooms/options",
				element: <Options />
			}
		]
	},
	{
		path: "/chat",
		element: <ChatInterface />,
	}
])


