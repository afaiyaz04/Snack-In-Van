import React from "react";
// used to access vanState
import { useSelector } from "react-redux";
import { getVan } from "../../redux/Van/van.selectors";
import SearchButton from "../buttons/SearchButton";
import BackButton from "../buttons/BackButton";

// Just changed some of the variables to not be dependent on redux
const Header = (props) => {
	const van = useSelector(getVan);
	const vanIcon =
		"https://anima-uploads.s3.amazonaws.com/projects/60879b3ae3bf9ecdd70c646a/releases/608cb648f68e88411d27085a/img/van-icon@1x.png";
	const name = van.name;
	const locDescription = van.locDescription;
	const backButtonAction = props.backButtonAction;
	const searchButtonAction = props.searchButtonAction;

	return (
		<div className="header flex-row">
			<BackButton handleClick={() => backButtonAction()} />
			<div className="header__middle-container flex-row">
				<img
					className="header__van-icon"
					src={vanIcon}
					alt="van-icon"
				/>
				<div className="header__van-details">
					<div className="heading">{name}</div>
					<div className="subheading">{locDescription}</div>
				</div>
			</div>
			<div className="set-invisible">
				<SearchButton handleClick={() => searchButtonAction()} />
			</div>
		</div>
	);
};

export default Header;
