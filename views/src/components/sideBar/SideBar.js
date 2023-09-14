import React from "react";

import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { APIlogoutUser } from "../../app/apiCalls";
import { getVendor } from "../../redux/Vendor/vendor.selectors";
import { deleteVendor } from "../../redux/Vendor/vendor.actions";
import SideBarButton from "../buttons/SideBarButton";

// Just changed some of the variables to not be dependent on redux
const SideBar = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const vendor = useSelector(getVendor);
	// Need it when the vendor image is going to be displayed
	const vanIcon =
		"https://anima-uploads.s3.amazonaws.com/projects/60879b3ae3bf9ecdd70c646a/releases/608cb648f68e88411d27085a/img/van-icon@1x.png";
	const name = vendor.name;

	const handleCurrClick = () => {
		history.push("/vendor/orders/curr");
	};

	const handlePastClick = () => {
		history.push("/vendor/orders/past");
	};

	const handleVanClick = () => {
		history.push("/vendor/status");
	};

	const handleLogoutClick = async () => {
		history.push("/");
		await APIlogoutUser();
		dispatch(deleteVendor());
	};

	return (
		<div className="side-bar">
			<div className="side-bar__user">
				<img src={vanIcon} alt="" />
				<h3 className="heading">{name}</h3>
			</div>
			<SideBarButton
				text="Today's Order"
				logo="hamburger"
				handleClick={() => handleCurrClick()}
			/>
			<SideBarButton
				text="Past Order"
				logo="history"
				handleClick={() => handlePastClick()}
			/>
			<SideBarButton
				text="My Van"
				logo="map-marker"
				handleClick={() => handleVanClick()}
			/>
			<div
				className="side-bar__logout subheading"
				onClick={handleLogoutClick}
			>
				Logout
			</div>
		</div>
	);
};

export default SideBar;
