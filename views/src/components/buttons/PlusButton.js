import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PlusButton() {
	return (
		<button className="btn" id="quantity-btn">
			<FontAwesomeIcon icon="plus" />
		</button>
	);
}

export default PlusButton;
