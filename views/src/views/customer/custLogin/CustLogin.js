import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
// Components
import BackButtonWhite from "../../../components/buttons/BackButtonWhite";
// Api calls
import { APIloginUser } from "../../../app/apiCalls";
// Logo
import logo from "../../../assets/Pin.png";

function Login() {
	return (
		// this centers the page contents
		<div
			id="page-container"
			className="container-center-horizontal red-background"
		>
			<div id="login__contents" className="container-center-vertical">
				<div className="login__image">
					<div className="white__backbutton">
						<BackButtonWhite />
					</div>
					<div>
						<img
							className="login__icon center flex-row"
							src={logo}
							alt="van-icon"
						/>
					</div>
				</div>
				<div className="login__bottom-panel">
					<LoginPanel />
				</div>
			</div>
		</div>
	);
}
export default Login;

// FUNCTIONAL COMPONENTS
// Handles the Login form
function LoginPanel() {
	const history = useHistory();
	const { register, handleSubmit } = useForm();

	async function onSubmit(data) {
		await APIloginUser(
			{
				email: data.email,
				password: data.password,
			},
			history
		);
	}
	return (
		<div className="login-panel">
			<h1 className="login-panel__heading heading">
				<span>Please enter your details</span>
			</h1>

			<form
				className="login-panel__form"
				onSubmit={handleSubmit(onSubmit)}
			>
				<label className="login-panel__form-header normaltext">
					Email
				</label>
				<input
					type="email"
					className="form-item"
					name="email"
					{...register("email", { required: true })}
				/>
				<label className="login-panel__form-header normaltext">
					Password
				</label>
				<input
					type="password"
					className="login-panel__form-item"
					name="password"
					{...register("password", { required: true })}
				/>
				<button
					type="submit"
					id="login-panel__submitbtn"
					className="login-panel__form-item subheading"
				>
					Login
				</button>
			</form>
			<Link to={"/register/"}>
				<div
					id="login-panel__submitbtn"
					className="login-panel__form-item subheading"
				>
					Register
				</div>
			</Link>
		</div>
	);
}
