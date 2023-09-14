import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
function ProfileButton(props) {
	const customer = props.customer;
	const history = useHistory();
	const navigateTo = () => history.push("/profile/");

	if (customer === null) {
		return (
			<button className="btn set-invisible">
				<FontAwesomeIcon icon="bars" />
			</button>
		);
	}
	return (
		<button className="btn" onClick={() => navigateTo()}>
			<FontAwesomeIcon icon="bars" />
		</button>
	);
}

export default ProfileButton;
