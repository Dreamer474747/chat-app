import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentActiveRoom: ""
};
/* ('active room' and 'inactive room' is a concept i made up in my mind so i can develop this chat app better.)

when a user enters the app, and he is in the "/rooms" route, displaying AllRooms component, he's socket gets joined
in all of the rooms he has joined before. so he can receive messages from those rooms.

but the user can only receive messages from those rooms and cant send messages to any of those rooms. so all
of the rooms that the user cant send a message to, are inactive rooms. in order to
send a message, the user has to enter one of those rooms(and when the user enters a room, he gets directed to
the "/chat" route, displaying ChatInterface component).

now, a room that the user can receive messages from and can send a message to, is an active room. or we can just
say, the room that the user enters to, is his current active room. */

export const activeRoomSlice = createSlice({
	name: "activeRoom",
	initialState,
	reducers: {
		activeRoomChanged: (state, action) => {
			state.currentActiveRoom = action.payload;
		}
	}
})


export const { activeRoomChanged } = activeRoomSlice.actions;


export const selectCurrentActiveRoom = state => state.activeRoom.currentActiveRoom;


export default activeRoomSlice.reducer;