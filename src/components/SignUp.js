import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth, generateUserDocument, signInWithGoogle } from "../firebase";
import { toastr } from 'react-redux-toastr';

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");

	const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
		event.preventDefault();
		try{
			const { user } = await auth.createUserWithEmailAndPassword(email, password);
			generateUserDocument(user, { displayName });
		}
		catch(error){
			toastr.error('HIBA!', 'Hiba történt a regisztráció során!');
		}

		setEmail("");
		setPassword("");
		setDisplayName("");
	};

	const onChangeHandler = event => {
		const { name, value } = event.currentTarget;
		if (name === "userEmail") {
			setEmail(value);
		} else if (name === "userPassword") {
			setPassword(value);
		} else if (name === "displayName") {
			setDisplayName(value);
		}
	};

	return (
		<>
		<div className="row" style={{maxWidth: 80 + '%', margin: 'auto'}}>
			<div className="col-md-6 offset-md-3">
				<h3 style={{marginTop: 20 + 'px'}}>Regisztráció</h3>
				<hr />
				<form>
					<div className="mb-3">
						<label htmlFor="displayName" className="form-label">Megjelenítendő név:</label>
						<input type="text" name="displayName" value={ displayName } className="form-control" id="displayName" onChange = {(event) => onChangeHandler(event)} />
					</div>
					<div className="mb-3">
						<label htmlFor="userEmail" className="form-label">Email cím:</label>
						<input type="email" name="userEmail" value={ email } className="form-control" id="userEmail" onChange = {(event) => onChangeHandler(event)} />
					</div>
					<div className="mb-3">
						<label htmlFor="userPassword" className="form-label">Jelszó:</label>
						<input type="password" name="userPassword" value={ password } className="form-control" id="userPassword" onChange = {(event) => onChangeHandler(event)} />
					</div>
					<button type="submit" className="btn btn-success" style={{width: 100 + '%'}} onClick={event => { createUserWithEmailAndPasswordHandler(event, email, password); }}>Regisztráció</button>
				</form>
				
				<p style={{textAlign: 'center', marginTop: 10 + 'px'}}>vagy</p>
				<button className="btn btn-danger" style={{width: 100 + '%'}} onClick={() => { try{ signInWithGoogle() } catch(error) { console.log("error google login: ", error) }}}><i className="fab fa-google"></i> Bejelentkezés Google fiókkal</button>
				<p className="text-center my-3">
				Van már fiókod?{" "}
				<Link to="/">
					Jelentkezz be itt!
				</Link>{" "}
				</p>
			</div>
		</div>
		</>
	);

};

export default SignUp;