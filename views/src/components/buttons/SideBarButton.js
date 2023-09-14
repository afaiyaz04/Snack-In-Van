import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../app/style.css";

function SideBarButton(props) {
	const { text, logo, handleClick } = props;
	return (
		<div className="side-bar-button" onClick={() => handleClick()}>
			<FontAwesomeIcon icon={logo} />
			<h2 className="subheading">{text}</h2>
		</div>
	);
}

export default SideBarButton;
