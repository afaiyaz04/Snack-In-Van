import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { APIregisterUser } from "../../../app/apiCalls";
import { SUCCESS } from "../../../app/statusEnums";
import registerIcon from "../../../assets/Register.png";
import BackButtonWhite from "../../../components/buttons/BackButtonWhite";

function Register() {
	return (
		// this centers the page contents
		<div
			id="page-container"
			className="container-center-horizontal red-background"
		>
			<div id="register__contents" className="container-center-vertical">
				<div className="register__image">
					<div className="white__backbutton">
						<BackButtonWhite />
					</div>
					<div>
						<img
							className="register__icon  center flex-row"
							src={registerIcon}
							alt="van-icon"
						/>
					</div>
				</div>
				<div className="register__bottom-panel">
					<RegisterForm />
				</div>
			</div>
		</div>
	);
}
export default Register;

function RegisterForm() {
	const { register, handleSubmit } = useForm();
	const history = useHistory();

	async function onSubmit(data) {
		if (
			(await APIregisterUser({
				email: data.email,
				password: data.password,
				password2: data.password2,
				nameGiven: data.firstname,
				nameFamily: data.familyname,
			})) === SUCCESS
		) {
			history.push("/login");
		}
	}

	return (
		<div className="login-panel">
			<h1 className="register__panel-heading heading">
				<span>Please enter your details</span>
			</h1>
			<h2 className="register__panel-heading subheading">
				<span>Youll be asked to verify your details for security</span>
			</h2>
			<form
				className="register__panel-form"
				onSubmit={handleSubmit(onSubmit)}
			>
				<label className="register__for-header normaltext">
					First Name
				</label>
				<input
					defautlValue="firstname"
					type="firstname"
					{...register("firstname", { required: true })}
				/>

				<label className="register__for-header normaltext">
					Family Name
				</label>
				<input
					defautlValue="familyname"
					type="familyname"
					{...register("familyname", { required: true })}
				/>

				<label className="register__for-header normaltext">email</label>
				<input
					defautlValue="email"
					type="email"
					{...register("email", { required: true })}
				/>

				<label className="register__for-header normaltext">
					password
				</label>
				<input
					defautlValue="password"
					type="password"
					{...register("password", { required: true })}
				/>

				<label className="register__for-header normaltext">
					password2
				</label>
				<input
					defautlValue="password"
					type="password"
					{...register("password2", { required: true })}
				/>
				<br />

				<button
					type="submit"
					id="register__panel-submitbtn"
					className="login-panel__form-item subheading "
				>
					Submit
				</button>
			</form>
		</div>
	);
}
