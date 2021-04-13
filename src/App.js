import React, { useState, useEffect, useContext } from 'react';
import './App.css';

import Application from './components/Application';
import UserProvider, { UserContext } from './providers/UserProvider';

import { useCookies } from 'react-cookie';
import { Link } from "@reach/router";

import { createStore, combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { Provider }  from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

function App() {
	const user = useContext(UserContext);

	const reducers = {
		toastr: toastrReducer
	}
	const reducer = combineReducers(reducers)
	const store = createStore(reducer)

	const [cookies, setCookie] = useCookies(['theme', 'textTheme']);
	if(cookies.theme === undefined || cookies.textTheme === undefined){
		setCookie('theme', 'light', { path: '/' });
		setCookie('textTheme', 'dark', { path: '/' });
		setCookie('themeColor', '', { path: '/' })
		document.body.className = '';
	} else if(cookies.theme === 'dark' && cookies.textTheme === 'white'){
		document.body.className = 'bg-dark text-light';
	} else {
		document.body.className = ''
	}

	const themeToggler = () => {
		if(cookies.theme === 'dark'){
			setCookie('theme', 'light', { path: '/' });
			setCookie('textTheme', 'dark', { path: '/' });
		} else {
			setCookie('theme', 'dark', { path: '/' });
			setCookie('textTheme', 'white', { path: '/' });
		}
	}

  	return (
    	<>
    	<Provider store={store}>
		<ReduxToastr
			timeOut={5000}
			newestOnTop={true}
			preventDuplicates={false}
			position="bottom-right"
			getState={(state) => state.toastr} // This is the default
			transitionIn="bounceIn"
			transitionOut="bounceOut"
			progressBar
			closeOnToastrClick/>

		<nav className={cookies.theme === 'dark' ? "navbar navbar-expand-lg navbar-dark" : "navbar navbar-expand-lg navbar-light bg-light"} style={{backgroundColor: cookies.theme === 'dark' ? '#1b1b1b' : ''}}>
			<div className="container-fluid">
				<a className="navbar-brand"><img src={cookies.theme === "dark" ? "img/inventory-light.png" : "img/inventory.png"} style={{width: 30 + 'px'}} /> Leltár applikáció</a>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<div className="navbar-nav">
						<Link className="nav-link" to="/">Kezdőlap</Link>
						{/* <Link className="nav-link" to="profile">Profil</Link> */}
					</div>
				</div>
				<div className="form-check form-switch" style={{display: 'inline-flex'}}>
					<img src="img/sun-icon.jpg" style={{width: 25 + 'px', height: 25 + 'px', marginRight: 45 + 'px'}} />
						<input className="form-check-input" type="checkbox" name="theme" onClick={themeToggler} checked={cookies.theme === 'dark' ? "checked" : ""} />
					<img src="img/moon-icon.png" style={{width: 20 + 'px', height: 20 + 'px', marginLeft: 5 + 'px', marginTop: 3 + 'px'}} />
				</div>
			</div>
		</nav>

		<div className="container" style={{maxWidth: 100 + '%'}}>
				<UserProvider>
					<Application {...({ themeToggler, cookies })}/>
				</UserProvider>
		</div>
    </Provider>
    </>
  );
}

export default App;
