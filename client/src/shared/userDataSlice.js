import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	userData: {}
};



export const userDataSlice = createSlice({
	name: "userData",
	initialState,
	reducers: {
		userLoggedIn: (state, action) => {
			state.userData = action.payload;
		}
	}
})



export const { userLoggedIn } = userDataSlice.actions;


export const selectUserData = state => state.userData.userData;




export default userDataSlice.reducer;