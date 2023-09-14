// White Back Button
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router";

function BackButtonWhite() {
	const history = useHistory();
	// redirects to the previous page after click
	const navigateTo = () => history.push("/");
	return (
		<button className="btn-white" onClick={() => navigateTo()}>
			<FontAwesomeIcon icon="chevron-left" />
		</button>
	);
}

export default BackButtonWhite;
