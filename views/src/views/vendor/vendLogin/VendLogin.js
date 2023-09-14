import React from "react";
import BackButtonWhite from "../../../components/buttons/BackButtonWhite";
import logo from "../../../assets/Pin.png";

import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import { APIloginVendor } from "../../../app/apiCalls";
// import redux config

function VendLogin() {
	return (
		<div
			id="vendor-container"
			className="container-center-horizontal red-background"
		>
			<div className="container-center-horizontal">
				<div className="vendor-login__image">
					<div className="white__backbutton">
						<BackButtonWhite />
					</div>
					<div>
						<img
							className="vendor-login__icon"
							src={logo}
							alt="van-icon"
						/>
					</div>
					<div className="vendor-login__bottom-panel">
						<VendorPanel />
					</div>
				</div>
			</div>
		</div>
	);
}
export default VendLogin;

function VendorPanel() {
	const history = useHistory();
	const { register, handleSubmit } = useForm();

	async function onSubmit(data) {
		await APIloginVendor(
			{
				name: data.name,
				password: data.password,
			},
			history
		);
	}

	return (
		<div className="vendor-login__panel">
			<h1 className="vendor-login__panel-heading heading">Login</h1>
			<form
				className="vendor-login__panel-form"
				onSubmit={handleSubmit(onSubmit)}
			>
				<label className="vendor-login__panel-form-header normaltext">
					Name
				</label>
				<input
					type="text"
					className="vendor-login__form-item"
					name="name"
					placeholder="Name.."
					{...register("name", { required: true })}
				/>
				<label className="vendor-login-panel__form-header normaltext">
					Password
				</label>
				<input
					type="password"
					className="vendor-login__form-item"
					name="password"
					placeholder="Password.."
					{...register("password", { required: true })}
				/>
				<button
					type="submit"
					id="login-panel__submitbtn"
					className="vendor-login__form-item subheading"
				>
					Login
				</button>
			</form>
		</div>
	);
}
