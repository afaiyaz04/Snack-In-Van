import { React, Component } from "react";
import { Link } from "react-router-dom";

// import helper functions like this, any function doesnt produce <html tags> is a helper function,
// not a functional component and should be stored in this file
import { roundNum } from "../../../app/helperFunctions";

// import redux config
// access state by this.props.state.(order/customer/van)
// update state by this.props.setOrder(order), other update functions can be found in the redux folder in "action" files
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";

// components
import Header from "../../../components/header/Header"; // import header as an example

class NewView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stateObject: null,
		};
	}

	render() {
		// Don't render until API response has been recieved
		if (!this.state.stateObject) {
			return null;
		}

		// any constant value or function that you use in your DOM Object rendering should first be declared
		// above the return call like this, so that we can easily see where everything is being calculated
		const totalQuantity = roundNum(2.23123, 2);

		// keep event handlers in top level for ease of debugging, pass down to components as demonstrated below
		const handleClick = () => {
			const example = null;
			return example;
		};

		// Can link to other pages like this
		const pushHistory = () => {
			this.props.history.push("/");
		};

		return (
			<div>
				<Header />
				<div className="header"> placeholder header text </div>
				<FunctionalComponent handleClick={() => handleClick()} />
				<Link to={"/"}>
					<div>Link to another page like this with a DOM object</div>
				</Link>
				<div onClick={() => pushHistory()}>
					Link to another page like this with an onClick event handler
				</div>
				<div> use a constant value like this {totalQuantity}</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(NewView);

// This functional component stays within this page because it is only used on this page,
// if it were used on multiple pages it would be saved in a seperate file in the components folder
function FunctionalComponent(props) {
	const handleClick = props.handleClick;

	return (
		<div onClick={() => handleClick()}>
			Pass an onClick event handler down to a functional component like
			this
		</div>
	);
}
