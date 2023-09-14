import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function MinusButton() {
	return (
		<button className="btn" id="quantity-btn">
			<FontAwesomeIcon icon="minus" />
		</button>
	);
}

export default MinusButton;
