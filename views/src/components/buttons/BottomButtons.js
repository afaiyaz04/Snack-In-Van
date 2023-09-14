// Buttons for the bottom side of the page
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BottomButtons(props) {
	return (
		<div className="bottom-buttons flex-row">
			<div
				className="medium-button flex-row"
				onClick={() => props.button1Action()}
			>
				<div className="medium-button__back-icon">
					<FontAwesomeIcon icon="chevron-left" />
				</div>
				<div className="heading">{props.button1Text}</div>
			</div>
			<div
				className="medium-button flex-row"
				onClick={() => props.button2Action()}
			>
				<div className="heading">{props.button2Text}</div>
			</div>
		</div>
	);
}

export default BottomButtons;
