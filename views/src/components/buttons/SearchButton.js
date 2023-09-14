import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchButton() {
	return (
		<button className="btn" id="search-button">
			<FontAwesomeIcon icon="search" />
		</button>
	);
}

export default SearchButton;
