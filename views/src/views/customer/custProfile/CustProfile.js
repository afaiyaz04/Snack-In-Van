import { React } from "react";
// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";
// components
import { useForm } from "react-hook-form";
import settingsLogo from "../../../assets/Settings.png";
import BackButtonWhite from "../../../components/buttons/BackButtonWhite";
import { APIupdateName, APIupdatePassword } from "../../../app/apiCalls";
import { useSelector } from "react-redux";
import { getCustomerId } from "../../../redux/Customer/customer.selectors";
import { SUCCESS } from "../../../app/statusEnums";

function CustProfile() {
	return (
		<div
			id="page-container"
			className="container-center-horizontal red-background"
		>
			<div id="profile__contents" className="container-center-vertical">
				<div className="profile__image">
					<div className="white__backbutton">
						<BackButtonWhite />
					</div>
					<div>
						<img
							className="profile__icon center flex-row"
							src={settingsLogo}
							alt="settings-icon"
						/>
					</div>
				</div>

				<div className="profile__bottom-panel">
					<ChangeInfoPanel />
				</div>
			</div>
		</div>
	);
}
export default connect(mapStateToProps, mapDispatchToProps)(CustProfile);

function ChangeInfoPanel() {
	return (
		<div className="profile__panel">
			<h1 className="profile__panel-heading heading">
				<span>Edit Information</span>
			</h1>
			<NameForm />
			<PasswordForm />
		</div>
	);
}

function NameForm() {
	const { register, handleSubmit } = useForm();
	const customerId = useSelector(getCustomerId);

	async function onSubmit(data) {
		const res = await APIupdateName(
			{
				customerId: customerId,
				nameGiven: data.nameGiven,
				nameFamily: data.nameFamily,
			},
			history
		);
		if (res === SUCCESS) {
			alert("Succesfully updated names");
		}
	}

	return (
		<form className="profile__panel-form" onSubmit={handleSubmit(onSubmit)}>
			<label className="profile__panel-header normaltext">
				Given Name
			</label>
			<input
				type="text"
				className="profile__panel-form-item"
				name="nameGiven"
				{...register("nameGiven", { required: true })}
			/>
			<label className="profile__panel-header normaltext">
				Last Name
			</label>
			<input
				type="text"
				className="profile__panel-form-item"
				name="nameFamily"
				{...register("nameFamily", { required: true })}
			/>
			<button
				type="submit"
				id="profile__panel-submitbtn"
				className="profile__panel-form-item subheading"
			>
				Submit Updated Details
			</button>
		</form>
	);
}

function PasswordForm() {
	const { register, handleSubmit } = useForm();
	const customerId = useSelector(getCustomerId);

	async function onSubmit(data) {
		const res = await APIupdatePassword({
			customerId: customerId,
			password: data.password1,
			password2: data.password2,
		});

		if (res === SUCCESS) {
			alert("Succesfully updated names");
		}
	}

	return (
		<form className="profile__panel-form" onSubmit={handleSubmit(onSubmit)}>
			<label className="profile__panel-header normaltext">
				New Password
			</label>
			<input
				type="password"
				className="profile__panel-form-item"
				name="password"
				{...register("password", { required: true })}
			/>
			<label className="profile__panel-header normaltext">
				New Password
			</label>
			<input
				type="password"
				className="profile__panel-form-item"
				name="password2"
				{...register("password2", { required: true })}
			/>
			<button
				type="submit"
				id="profile__panel-submitbtn"
				className="profile__panel-form-form-item subheading"
			>
				Submit New Password
			</button>
		</form>
	);
}
