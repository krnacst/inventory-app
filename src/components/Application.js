import React, { useContext } from 'react';
import { Router } from '@reach/router';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Inventory from './Inventory';
import PasswordReset from './PasswordReset';
import { UserContext } from '../providers/UserProvider';
import ProfilePage from './ProfilePage';

function Application(props) {
	const user = useContext(UserContext);

	return(
		user ?
		//<Router style={{padding: 0}}>
			<Inventory {...(props)} />
		//	<ProfilePage path='profile' {...(props)} />
		//</Router>
		:

		<Router>
			<SignUp path = "signUp" />
			<SignIn path = "/" />
			<PasswordReset path = "passwordReset" />
		</Router>
	);
}

export default Application;