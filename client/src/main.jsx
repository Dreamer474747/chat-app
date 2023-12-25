import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/routes.jsx";

import { Provider } from "react-redux";
import { store } from "./app/store/store";

import "react-toastify/dist/ReactToastify.css";



createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>,
)
