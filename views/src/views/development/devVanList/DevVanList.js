import { React, Component } from "react";
import { Link } from "react-router-dom";
import { formatDist, getNearestVans } from "../../../app/helperFunctions";
import {
	APIauthCustomer,
	APIgetVanList,
	APIlogoutUser,
	APIshouldDelete,
} from "../../../app/apiCalls";
import { Map, Marker, Overlay } from "pigeon-maps";
import { stamenToner } from "pigeon-maps/providers";

// components
import logo from "../../../assets/Pin.png";
import ProfileButton from "../../../components/buttons/ProfileButton";

// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";
import { FAILURE } from "../../../app/statusEnums";

class VanList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vans: null,
			lat: null,
			lng: null,
		};
	}

	// query API
	componentDidMount = async () => {
		try {
			// get location
			navigator.geolocation.getCurrentPosition((location) => {
				this.setState({
					lat: location.coords.latitude,
					lng: location.coords.longitude,
				});
			});
			const vans = await APIgetVanList();

			this.setState({
				vans: vans,
			});

			const data = await APIauthCustomer();

			// type customer
			if (data !== FAILURE) {
				this.props.setCustomer(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		// Don't render until API response has been recieved
		if (!this.state.lat || !this.state.lng || !this.state.vans) {
			return null;
		}

		const color = "#ff7154";
		const userLat = this.state.lat;
		const userLng = this.state.lng;
		const vans = getNearestVans(userLat, userLng, this.state.vans);
		const handleLogoutClick = async () => {
			if (await APIshouldDelete(this.props.order)) {
				this.props.deleteOrder();
			}
			await APIlogoutUser();
			// if there is a pending order delete
			this.props.deleteCustomer();
			this.props.history.push("/login/");
		};

		// set selected van and move to menu page
		const handleVanClick = async (van) => {
			// if choosing new van clear order
			if (await APIshouldDelete(this.props.order)) {
				this.props.deleteOrder();
			}
			// set new van
			this.props.setVan(van);
			this.props.history.push("/menu");
		};

		return (
			<div id="page-container" className="container-center-vertical">
				<div id="van-list__header" className="header flex-row">
					<div className="van-list__header-button">
						<ProfileButton customer={this.props.customer} />
					</div>
					<div className="van-list__header-content">
						<img
							className="header__van-icon"
							src={logo}
							alt="van-icon"
						/>

						<div className="center heading">Snacks in a Van</div>
					</div>
					<div></div>
				</div>
				<div className="van-list__page-contents flex-column">
					<div className="map-container">
						<Map
							provider={stamenToner}
							dprs={[1, 4]}
							defaultCenter={[userLat, userLng]}
							defaultZoom={15}
						>
							<Marker
								width={30}
								anchor={[userLat, userLng]}
								color={color}
							/>
							{vans.map((object) => (
								<Overlay
									key={object.van._id}
									anchor={[
										object.van.location.lat,
										object.van.location.lng,
									]}
									offset={[10, 15]}
								>
									<img src={logo} height={35} alt="" />
								</Overlay>
							))}
						</Map>
					</div>
					<div className="van-list__bottom-panel flex-column">
						<div className="largeheading center padding">Vans</div>
						<div className="van-list__vans center">
							{vans.map((object) => (
								<VanItem
									key={object.van._id}
									name={object.van.name}
									locDescription={object.van.locDescription}
									distance={formatDist(object.distance)}
									handleClick={() =>
										handleVanClick(object.van)
									}
								/>
							))}
						</div>
						<AuthButton
							customer={this.props.customer}
							action={() => handleLogoutClick()}
						/>
					</div>
				</div>
			</div>
		);
	}
}
//connect to redux
export default connect(mapStateToProps, mapDispatchToProps)(VanList);

// FUNCTIONAL COMPONENTS

const AuthButton = (props) => {
	if (props.customer) {
		return (
			<div
				id="auth-button"
				className="medium-button heading center padding"
				onClick={() => props.action()}
			>
				Logout
			</div>
		);
	} else {
		return (
			<div className="van-list__button-list">
				<Link to={"/login/"}>
					<div id="auth-button" className="medium-button heading">
						Login
					</div>
				</Link>
				<Link to={"/register/"}>
					<div id="auth-button" className="medium-button heading">
						Register
					</div>
				</Link>
				<Link to={"/vendor/login/"}>
					<div id="auth-button" className="medium-button heading">
						Are you a vendor?
					</div>
				</Link>
			</div>
		);
	}
};

const VanItem = (props) => {
	const name = props.name;
	const locDescription = props.locDescription;
	const distance = props.distance;
	var meterage = " m";
	if (distance - Math.floor(distance) !== 0) {
		meterage = " Km";
	}
	const handleClick = props.handleClick;
	return (
		<div className="van-item" onClick={() => handleClick()}>
			<img className="van-item__pinLogo" src={logo} alt="pin" />
			<div className="van-item__info">
				<div className="van-item__info-name normaltext">{name}</div>
				<div className="van-item__info-location normaltext">
					{locDescription}
				</div>
			</div>
			<div className="van-item__distance">
				<div className="normaltext">
					{distance}
					{meterage}
				</div>
			</div>
		</div>
	);
};
