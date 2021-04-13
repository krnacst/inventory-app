import React, { useState, useEffect, useContext } from 'react';
import InventoryForm from './InventoryForm';
import { auth, firestore } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import { toastr } from 'react-redux-toastr';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Moment from 'react-moment';

const Inventory = (props) => {
	const user = useContext(UserContext);
  	const {photoURL, displayName, email, uid} = user;

	var [inventoryObjects, setInventoryObjects] = useState({});
	var [currentId, setCurrentId] = useState('');

	useEffect(() => {
		firestore.collection('users').doc(uid).collection('items').onSnapshot((snapshot) => {
			const inventoryDatas = [];
			snapshot.forEach((doc) => {
				inventoryDatas[doc.id] = {
					id: doc.id,
					...doc.data()
				};
			})
			setInventoryObjects(inventoryDatas);
		});
	},[]);

	const addOrEdit = (obj) => {
		if(currentId === '')
			firestore.collection('users').doc(uid).collection('items').doc()
				.set(obj)
				.catch(err => {
					console.log(err);
					toastr.error('HIBA!', 'Hiba lépett fel a hozzáadás közben!');
				})
				.then(
					setCurrentId(''),
					toastr.success('', 'Sikeresen hozzáadtad a terméket!')
				);
		else
			firestore.collection('users').doc(uid).collection('items').doc(currentId)
				.update(obj)
				.catch(err => {
					console.log(err);
					toastr.error('HIBA!', 'Hiba lépett fel a szerkesztés közben!');
				})
				.then(
					setCurrentId(''),
					toastr.success('', 'Sikeresen szerkesztetted a terméket!')
				);
	}

	const onDelete = key => {
		if(window.confirm('Biztosan törölni akarod?')){
			firestore.collection('users').doc(uid).collection('items').doc(key)
			.delete()
			.catch(err => {
				console.log(err);
				toastr.error('HIBA!','Hiba lépett fel a termék törlése közben!');
			})
			.then(
				setCurrentId(''),
				toastr.success('','Termék sikeresen törölve!')
			);
		}
	}

	const addCart = (key, state) => {
		firestore.collection('users').doc(uid).collection('items').doc(key)
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

	const changePiece = (key, number) => {
		firestore.collection('users').doc(uid).collection('items').doc(key)
		.update({
			piece: number
		});

		if(number === 0){
			addCart(key, true);
		} else if(number === 1) {
			addCart(key, false);
		}
	}

	var datas = Object.values(inventoryObjects);
	//console.log(inventoryObjects);

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
			<a className="btn text-primary" title="Szerkesztés" onClick={() => { setCurrentId(row.id) }}>
				<i className="fas fa-pencil-alt"></i>
			</a>
			<a className="btn text-success" title="Bevásárló listához adás" onClick={() => { row.cart ? addCart(row.id, false) : addCart(row.id, true) }}>
				<i className={row.cart ? "fas fa-cart-arrow-down" : "fas fa-cart-plus"}></i>
			</a>
			<a className="btn text-danger" title="Törlés" onClick={() => onDelete(row.id)}>
				<i className="fas fa-trash-alt"></i>
			</a>
			</>
		)
	}

	function pieceFormatter(cell, row) {
		return(
			<>
				<button disabled={row.piece < 1 ? "disabled" : ""} className="btn btn-primary btn-sm" onClick={() => changePiece(row.id, row.piece - 1)}>-</button> {row.piece} db <button className="btn btn-primary btn-sm" onClick={() => changePiece(row.id, row.piece + 1)}>+</button>
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

	const customTotal = (from, to, size) => (
		<span className="react-bootstrap-table-pagination-total">
		  Megjelenítve: { from } - { to } / { size } db.
		</span>
	);

	const paginationOptions = {
		paginationSize: 4,
		pageStartIndex: 1,
		// alwaysShowAllBtns: true, // Always show next and previous button
		// withFirstAndLast: false, // Hide the going to First and Last page button
		// hideSizePerPage: true, // Hide the sizePerPage dropdown always
		hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
		firstPageText: 'Első',
		prePageText: 'Előző',
		nextPageText: 'Következő',
		lastPageText: 'Utolsó',
		nextPageTitle: 'Első oldal',
		prePageTitle: 'Előző oldal',
		firstPageTitle: 'Következő oldal',
		lastPageTitle: 'Utolsó oldal',
		showTotal: true,
		paginationTotalRenderer: customTotal,
		disablePageTitle: true,
		sizePerPageList: [{
		  text: '5 db', value: 5
		}, {
		  text: '10 db', value: 10
		}, {
		  text: '15 db', value: 15
		}, {
		  text: '20 db', value: 20
		}, {
		  text: 'Összes termék', value: datas.length
		}]
	  };

	const tableTheme = props.cookies.theme === 'dark' ? "table-dark" : "";

	const { SearchBar } = Search;

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

	const defaultSorted = [{
		dataField: 'name',
		order: 'desc'
	}];

	const dateExpand = {
		renderer: row => (
		  <div>
			<p>
				Hozzáadás dátuma: <b><Moment format="YYYY-MM-DD HH:mm:ss">{ `${row.timestamp}` }</Moment></b>
			</p>
			<p>
				Itt érdemes venni: <img src={'img/' + row.where + '.png'} style={{width: 20 + 'px'}} /> <b>{ `${row.where}` }</b>
			</p>
		  </div>
		)
	  };


	return(
		<>
		<div className="row" style={{maxWidth: 80 + '%', margin: 'auto'}}>
				<div className="col-md-4" style={{float: 'left'}}>
					<h5 style={{marginTop: 10 + 'px'}}>Dolgok felvétele</h5>
					<InventoryForm {...({ addOrEdit, currentId, inventoryObjects })} />
				</div>
				
				<div className="col-md-8" style={{float: 'right'}}>
					<ToolkitProvider
						keyField='id' 
						data={ datas } 
						columns={ columns }
						search
					>
						{
							props => (
							<>
								<h5 style={{marginTop: 10 + 'px'}}>{user.displayName} termékeinek listája <span className="badge rounded-pill bg-secondary">{ datas.length === 0 ? "Üres" : datas.length + " db" }</span></h5>
								<label htmlFor="search-bar-0" className="form-label">
									Keresés
								</label>
								<br/>
								<i className="fas fa-search text-dark" style={{position: 'absolute', margin: 12 + 'px'}}></i>
								<SearchBar 
									{ ...props.searchProps } 
									placeholder=" "
									style={ {paddingLeft: 35 + 'px'} }
									className={'form-control'}
								/>
								<button className = "btn btn-primary" style={{float: 'right'}} onClick = {() => {auth.signOut()}}>Kijelentkezés</button>
								<hr />
								<BootstrapTable
									{ ...props.baseProps } 
									bordered={ false }
									classes={ tableTheme }
									rowClasses={ cartClasses }
									noDataIndication="A lista üres!"
									defaultSorted={ defaultSorted }
									pagination={ paginationFactory(paginationOptions) }
									expandRow={ dateExpand }
								/>
							</>
							)
						}
					</ToolkitProvider>	
				</div>
			</div>
		</>
	);
}

export default Inventory;