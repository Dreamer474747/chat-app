import { configureStore } from "@reduxjs/toolkit";

import userDataSlice from "../../shared/userDataSlice";
import userRoomsSlice from "../../shared/userRoomsSlice";
import activeRoomSlice from "../../shared/activeRoomSlice";



export const store = configureStore({
	reducer: {
		userData: userDataSlice,
		userRooms: userRoomsSlice,
		activeRoom: activeRoomSlice
	}
})












