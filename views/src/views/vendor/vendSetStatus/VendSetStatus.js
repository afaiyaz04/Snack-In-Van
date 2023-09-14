import { React, Component } from "react";
// import redux config
import { connect } from "react-redux";
import { throttle } from "lodash";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";
import { Map, Marker } from "pigeon-maps";
import { stamenToner } from "pigeon-maps/providers";

// components
import SideBar from "../../../components/sideBar/SideBar";
import { VAN_CLOSED, VAN_OPEN, FAILURE } from "../../../app/statusEnums";
import {
	APIsetVanClose,
	APIsetVanOpen,
	APIauthVendor,
} from "../../../app/apiCalls";
// import { setVanOpen } from "app/apiCalls";
class VendSetClose extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: null,
			lat: null,
			lng: null,
			value: "",
		};
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.throttledPopulateState = throttle(this.populateState, 1500);
	}

	showModal = () => {
		this.setState({ show: true });
	};

	hideModal = () => {
		this.setState({ show: false });
	};

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event) {
		APIsetVanOpen(
			this.props.vendor._id,
			this.state.lat,
			this.state.lng,
			this.state.value
		);
		this.setState({ status: VAN_OPEN });
		event.preventDefault();
	}

	async populateState() {
		try {
			// bounce back unauthenticated users
			if ((await APIauthVendor()) === FAILURE) {
				this.props.history.push("/vendor/login");
			}
			// get location
			navigator.geolocation.getCurrentPosition((location) => {
				this.setState({
					lat: location.coords.latitude,
					lng: location.coords.longitude,
				});
				console.log(location);
			});
			console.log(location);
		} catch (err) {
			console.log(err);
		}
	}
	// Query API
	componentDidMount = async () => {
		await this.throttledPopulateState;
	};

	// Query API
	componentDidUpdate = async () => {
		await this.throttledPopulateState;
	};

	render() {
		//Don't render until API response has been recieved
		if (this.state.lat === undefined) {
			return null;
		}

		const handleClick = this.selectModal;

		const lat = this.state.lat;
		const lng = this.state.lng;
		const status = this.state.status;
		const vendor_id = this.props.vendor._id;
		const locDescription = this.props.vendor.locDescription;
		const handleClickClose = async () => {
			await APIsetVanClose(vendor_id);
			this.setState({ status: VAN_CLOSED });
			this.hideModal();
		};

		return (
			<div className="vendor-status">
				<SideBar />
				<div className="vendor-status__main">
					<div className="vendor-status__map">
						<Map
							provider={stamenToner}
							dprs={[1, 4]}
							height={500}
							defaultCenter={[lat, lng]}
							defaultZoom={16}
						>
							<Marker width={50} anchor={[lat, lng]} />
						</Map>
					</div>
					<StatusPanel
						locDescription={locDescription}
						status={status}
						handleClickClose={() => handleClick()}
						showModal={this.showModal}
						handleFormSubmit={this.handleSubmit}
						handleFormChange={this.handleChange}
						formValue={this.state.value}
					/>
				</div>
				<Modal
					handleClick={() => handleClickClose()}
					show={this.state.show}
				/>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(VendSetClose);

function StatusPanel(props) {
	console.log(props);
	const handleFormSubmit = props.handleFormSubmit;
	const handleFormChange = props.handleFormChange;
	const formValue = props.formValue;
	const locDescription = props.locDescription;
	const status = props.status;

	if (status === VAN_CLOSED) {
		return (
			<div className="vendor-open__bottom-panel">
				<AddressInput
					handleFormSubmit={handleFormSubmit}
					handleFormChange={handleFormChange}
					formValue={formValue}
				/>
			</div>
		);
	} else {
		return (
			<div>
				<div className="vendor-close-panel">
					<h1 className="vendor-close-panel__heading heading">
						<br />
						<span>{locDescription}</span>
					</h1>
					<button
						type="submit"
						id="vendor-close-panel__submitbtn"
						className="vendor-close-panel__form-item subheading"
						onClick={() => props.showModal()}
					>
						Close Business
					</button>
				</div>
			</div>
		);
	}
}

function AddressInput(props) {
	const handleFormSubmit = props.handleFormSubmit;
	const handleFormChange = props.handleFormChange;
	const formValue = props.formValue;
	return (
		<div className="address-input">
			<form className="address-input__form" onSubmit={handleFormSubmit}>
				<label className="address-input__form-header normaltext">
					Location Address
				</label>
				<input
					type="text"
					className="address-input__form-item"
					name="address"
					value={formValue}
					onChange={handleFormChange}
				/>
				<button
					type="submit"
					id="address-input__submitbtn"
					className="address-input__form-item subheading"
				>
					Open for Business
				</button>
			</form>
		</div>
	);
}

const Modal = (props) => {
	const handleClick = props.handleClick;

	if (props.show) {
		return (
			<div className="modal">
				<div className="modal__content">
					<span className="modal__close">&times;</span>
					<h1 className="modal__heading heading">My Van</h1>
					<br />
					<h2 className="modal__heading heading">
						Session Complete?
					</h2>
					<button
						type="submit"
						id="modal__submitbtn"
						className="modal__form subheading"
						onClick={() => handleClick()}
					>
						Close Business
					</button>
				</div>
			</div>
		);
	}
	return null;
};
