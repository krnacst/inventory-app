import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth } from "../firebase";
import { toastr } from 'react-redux-toastr';

const PasswordReset = () => {
	const [email, setEmail] = useState("");

	const onChangeHandler = event => {
		const { name, value } = event.currentTarget;

		if (name === "userEmail") {
			setEmail(value);
		}
	};

	const sendResetEmail = event => {
		event.preventDefault();
		auth
			.sendPasswordResetEmail(email)
			.then(() => {
				toastr.success('', 'Email sikeresen elküldve a megadott címre!');
				setTimeout(() => {
					toastr.error('HIBA!', 'Hiba történt a jelszó-emlékeztető küldése során!')
				}, 3000);
			})
			.catch(() => {
				toastr.error('HIBA!', 'Hiba történt a jelszó-emlékeztető küldése során!');
			});
	  };
	return (
		<>
		<div className="row" style={{maxWidth: 80 + '%', margin: 'auto'}}>
			<h3 className="">
				Jelszó emlékeztető
			</h3>
			<hr />
			<form>
				<div className="row g-4 align-items-center">
					<div class="col-auto">
						<label htmlFor="userEmail" className="form-label">Email cím: </label>
					</div>
					<div className="col-auto">
						<input type="email" name="userEmail" value={ email } className="form-control" id="userEmail" onChange={onChangeHandler} />
					</div>
					<div className="col-auto">
						<button className="btn btn-primary" onClick={sendResetEmail}>Jelszó emlékeztető küldése</button>
					</div>
				</div>
			</form>
			<Link to ="/" className="">
			&larr; vissza a bejelentkezéshez
			</Link>
		</div>
		</>
  );
};
export default PasswordReset;