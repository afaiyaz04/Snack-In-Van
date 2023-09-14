// BackButton
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function BackButton(props) {
	// redirects to the previous page after click
	const handleClick = props.handleClick;
	return (
		<button className="back-button btn" onClick={() => handleClick()}>
			<FontAwesomeIcon icon="chevron-left" />
		</button>
	);
}

export default BackButton;
