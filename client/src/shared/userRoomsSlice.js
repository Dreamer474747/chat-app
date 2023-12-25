import { createSlice } from "@reduxjs/toolkit";



const initialState = {
	rooms: []
};




export const userRoomsSlice = createSlice({
	name: "userRooms",
	initialState,
	reducers: {
		userRoomsCollected: (state, action) => {
			state.rooms = action.payload;
		}
	}
})



export const { userRoomsCollected } = userRoomsSlice.actions;


export const selectUserRooms = state => state.userRooms.rooms;


export default userRoomsSlice.reducer;