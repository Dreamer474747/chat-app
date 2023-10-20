import { useNavigate } from "react-router-dom";

import { Drawer, Box, Tabs, Tab } from "@mui/material/";

import { useSelector, useDispatch } from "react-redux";

import TabsDataArray from "../../constants/TabsData";
import loginLogoutImg from "../../../public/svgs/logout-login.svg";

import { selectNavbarFlag, changeNavbarFlag, makeNavbarFlagFalse } from "../../reducers/sidebarSlice";
import { userInfoEmpty } from "../../reducers/userInfoSlice";




const NavbarDrawer = ({ selectedTabIndex, handleTabIndexChange }) => {
	
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	const tabsData = TabsDataArray();
	
	const navbarFlag = useSelector(selectNavbarFlag);
	
	
	
	
	
	const logOut = () => {
		dispatch(userInfoEmpty());
		navigate("/sign-in");
	}
	
	
	
	
	
	return (
		<>
			<Drawer
			open={navbarFlag}
			onClose={() => dispatch(changeNavbarFlag())}
			variant="temporary"
			sx={{
				"& .MuiDrawer-paper": {
					width: 250,
					justifyContent: "space-evenly",
				},
				display: { xs: "flex", lg: "none" },
				flexDirection: "column",
			}}
			>
			
				<Box sx={{ width: "100%" }}>
					<Tabs
						orientation="vertical"
						value={selectedTabIndex}
						onChange={handleTabIndexChange}
					>
						
					{
						tabsData.map((tab, index) => (
							<Tab
							key={index}
							onClick={() => {
								dispatch(makeNavbarFlagFalse())
								navigate(tab.path)
							}}
							sx={{
								padding: "1.3rem 0",
								marginBottom: "0.5rem",
								width: 1,
								"&.Mui-selected": {
									backgroundColor: "#1b1b1b",
								}
							}}
							icon = { selectedTabIndex === tab.index ? tab.filledIcon : tab.outlinedIcon }
							/>
						))
					}
					</Tabs>
				</Box>
			
				<img
				alt="login-logout"
				src={loginLogoutImg}
				style={{ cursor: "pointer", margin: "0 auto", width: "3rem" }}
				onClick={logOut}
				/>
			
			</Drawer>
		</>
	)
}


export default NavbarDrawer;



