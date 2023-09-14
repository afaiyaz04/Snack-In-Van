import { React, Component } from "react";

// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";

// components

class CustMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stateObject: "placeholder",
		};
	}

	// Query API
	componentDidMount = async () => {};

	// Query API again when component is updated in case there are changes
	componentDidMount = async () => {};

	render() {
		// Don't render until API response has been recieved
		if (!this.state.stateObject) {
			return null;
		}

		return (
			<div>
				<div>Placeholder</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(CustMap);
