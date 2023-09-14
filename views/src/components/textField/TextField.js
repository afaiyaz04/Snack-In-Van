import React from "react";

function TextField(props) {
	const { text, className } = props;
	return (
		<div className={`text-field ${className || ""}`}>
			<div>{text}</div>
		</div>
	);
}
export default TextField;
