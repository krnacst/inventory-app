import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth, signInWithGoogle } from "../firebase";
import { toastr } from 'react-redux-toastr';

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	
	const signInWithEmailAndPasswordHandler = (event, email, password) => {
		event.preventDefault();
		if(email === '' || password === ''){
			toastr.error('', 'Minden mező kitöltése kötelező!');
		} else {
			auth.signInWithEmailAndPassword(email, password)
				.catch(error => {
					if(error.code === "auth/user-not-found"){
						toastr.error('', 'Nem létezik ilyen felhasználó!');
					} else if(error.code === "auth/invalid-email"){
						toastr.error('', 'Az email formátum nem megfelelő!');
					} else if(error.code === "auth/wrong-password"){
						toastr.error('', 'Hibás email cím vagy jelszó!');
					} else {
						toastr.error('HIBA!', 'Hiba történt a bejelentkezés során!');
					}
					console.error('Hiba történt az email/jelszó bejelentkezés során: ', error);
				});
		}
	};
	
	const onChangeHandler = (event) => {
		const {name, value} = event.currentTarget;

		if(name === 'userEmail') {
			setEmail(value);
		} else if(name === 'userPassword'){
		  	setPassword(value);
		}
	};

	return(
		<>
		<div className="row" style={{maxWidth: 80 + '%', margin: 'auto'}}>
			<div className="col-md-6 offset-md-3">
				<h3 style={{marginTop: 20 + 'px'}}>Bejelentkezés</h3>
				<hr />
				<form>
					<div className="mb-3">
						<label htmlFor="userEmail" className="form-label">Email cím</label>
						<input type="email" name="userEmail" value={ email } className="form-control" id="userEmail" onChange = {(event) => onChangeHandler(event)} />
					</div>
					<div className="mb-3">
						<label htmlFor="userPassword" className="form-label">Jelszó</label>
						<input type="password" name="userPassword" value={ password } className="form-control" id="userPassword" onChange = {(event) => onChangeHandler(event)} />
					</div>
					<button type="submit" className="btn btn-success" style={{width: 100 + '%'}} onClick = {(event) => { signInWithEmailAndPasswordHandler(event, email, password); }}>Bejelentkezés</button>
				</form>
				<p style={{textAlign: 'center', marginTop: 10 + 'px'}}>vagy</p>
				<button className="btn btn-danger" style={{width: 100 + '%'}} onClick={() => {signInWithGoogle()}}><i className="fab fa-google"></i> Bejelentkezés Google fiókkal</button>
				<p className="text-center my-3">
				Nincsen még fiókod?{" "}
				<Link to="signUp" >
					Regisztrálj itt!
				</Link>{" "}
				<br />{" "}
				<Link to = "passwordReset">
					Elfelejtetted jelszavad?
				</Link>
				</p>
			</div>
		</div>
		</>
	)

}

export default SignIn