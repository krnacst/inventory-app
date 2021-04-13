import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../providers/UserProvider";
import { auth, firestore } from '../firebase';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Moment from 'react-moment';
import { toastr } from 'react-redux-toastr';
import { conditionalExpression } from '@babel/types';

function ProfilePage(props) {
	const user = useContext(UserContext);
	const {photoURL, displayName, email, uid, regDate, shareWith, shareFrom} = user;

	var [otherObjects, setOtherObjects] = useState({});
	var [idList, setIdList] = useState({});
	var [currentId, setCurrentId] = useState('');

	useEffect(() => {
		if(shareFrom !== []){
			const idList = [];
			shareFrom.forEach((otherID) => {
				idList.push({
					id: otherID
				})
			});

			var i = 0;
			idList.forEach((ids) => {
				firestore.collection('users').doc(ids.id).onSnapshot((snapshot) => {
					idList[i].name = (snapshot.data() && snapshot.data().displayName)
					i++
				})
			});

			setIdList(idList);
		}
	},[]);

	const handleInputChange = e => {
		var { value } = e.target;
		firestore.collection('users').doc(value).collection('items').onSnapshot((snapshot) => {
			const inventoryDatas = [];
			snapshot.forEach((doc) => {
				inventoryDatas.push({
					other: value,
					id: doc.id,
					...doc.data()
				});
			})
			setOtherObjects(inventoryDatas);
		});
	};

	var otherDatas = Object.values(otherObjects);

	const shareOther = () => {

	}

	const addCart = (id, key, state) => {
		firestore.collection('users').doc(id).collection('items').doc(key)
		.update({
			cart: state
		})
		.catch(err => {
			console.log(err);
			toastr.error('HIBA!', 'Hiba lépett fel a kosárba helyezés közben!');
		})
		.then(
			state === 1 ? 
				toastr.success('', 'Termék hozzáadva a bevásárlólistához!') 
			: 
				toastr.success('', 'Termék kivéve a bevásárlólistából!')
		);
	}

	const changePiece = (id, key, number) => {
		firestore.collection('users').doc(id).collection('items').doc(key)
			.update({
				piece: number
			});

		if(number === 0){
			addCart(id, key, true);
		} else if(number === 1) {
			addCart(id, key, false);
		}
	}

	function cartFormatter(cell, row) {
		if(row.cart){
			return(
				<span className="btn text-success">
					<i className="fas fa-check-circle"></i>
				</span>
			)
		}

		return(
			<span className="btn text-danger">
				<i className="fas fa-times-circle"></i>
			</span>
		)
	}

	function actionFormatter(cellContent, row) {
		return(
			<>
			<a className="btn text-success" title="Bevásárló listához adás" onClick={() => { row.cart ? addCart(row.other, row.id, false) : addCart(row.other, row.id, true) }}>
				<i className={row.cart ? "fas fa-cart-arrow-down" : "fas fa-cart-plus"}></i>
			</a>
			</>
		)
	}

	function pieceFormatter(cell, row) {
		return(
			<>
				<button disabled={row.piece < 1 ? "disabled" : ""} className="btn btn-primary btn-sm" onClick={() => changePiece(row.other, row.id, row.piece - 1)}>-</button> {row.piece} db <button className="btn btn-primary btn-sm" onClick={() => changePiece(row.other, row.id, row.piece + 1)}>+</button>
			</>
		)
	}

	const cartClasses = (row, cell) => {
		let classes = null;

		if(row.cart){
			classes = "table-danger"
		}

		return classes;
	}

	const columns = [{
		dataField: 'name',
		text: 'Megnevezés',
		sort: true,
		headerAlign: 'center'
	}, {
		dataField: 'piece',
		text: 'Mennyiség',
		sort: true,
		headerAlign: 'center',
		align: 'center',
		formatter: pieceFormatter
	}, {
		dataField: 'cart',
		text: 'Kell?',
		sort: true,
		headerAlign: 'center',
		align: 'center',
		formatter: cartFormatter
	}, {
        dataField: 'actions',
        isDummyField: true,
		text: 'Műveletek',
		headerAlign: 'center',
		align: 'center',
        formatter: actionFormatter
    }];

	return(
		<>
		<div className="row" style={{maxWidth: 80 + '%', margin: 'auto'}}>
			<div className="col-md-5" style={{marginTop: 10 + 'px', float: 'left'}}>
			<h5>Profil adatok</h5>
			<hr />
				<table className={props.cookies.theme === "dark" ? "table table-striped table-dark" : "table table-striped"}>
					<tbody>
						<tr>
							<td colSpan="2" style={{textAlign: 'center'}}>
								<img src={photoURL} style={{borderRadius: 50 + 'px'}} />
							</td>
						</tr>
						<tr>
							<td>Név: </td>
							<td>{displayName}</td>
						</tr>
						<tr>
							<td>Email: </td>
							<td>{email}</td>
						</tr>
						<tr>
							<td>Regisztráció dátuma: </td>
							<td><Moment format="YYYY-MM-DD HH:mm:ss">{ `${regDate}` }</Moment></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="col-md-6" style={{marginTop: 10 + 'px', float: 'right'}}>
				<h5>Lista megosztások</h5>
				<form >
					<input className="form-control" type="email" />
					<button className="btn btn-primary" type="submit">Hozzáadás</button>
				</form>
				<hr />
				<table className={props.cookies.theme === "dark" ? "table table-striped table-dark" : "table table-striped"}>
					<thead>
						<tr>
							<th>Név</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>
						<tr>

						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<br/>
		<div className="row" style={{maxWidth: 80 + '%', margin: 'auto'}}>
			<div className="col-md">
				<h5>Megosztott listák</h5>
				<hr />
				<select className="form-control" onChange={handleInputChange}>
					<option defaultChecked>Válassz...</option>
					{
						Object.keys(idList).map((id) => {
							return <option key={idList[id].id} value={idList[id].id}>{idList[id].name} listája</option>
						})
					}
				</select>
				<BootstrapTable
					keyField='other'
					data={ otherDatas }
					columns = {columns}
					bordered={ false }
					rowClasses={ cartClasses }
					noDataIndication="A lista üres!"
				/>
			</div>
		</div>
		
		</>
	);
}

export default ProfilePage;