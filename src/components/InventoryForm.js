import React, { useState, useEffect } from "react";
import { toastr } from 'react-redux-toastr';

const InventoryForm = (props) => {
	const initialFieldValues = {
		name: '',
		piece: 0,
		where: '',
		cart: false,
		timestamp: Date()
	};

	var [values, setValues] = useState(initialFieldValues);

	useEffect(() => {
		if(props.currentId === '') {
			setValues({
				...initialFieldValues
			});
		} else {
			setValues({
				...props.inventoryObjects[props.currentId]
			});
			toastr.info('', 'Egy termék szerkesztés alatt!');
		}
	}, [props.currentId, props.inventoryObjects]);

	const handleInputChange = e => {
		var { name, value } = e.target;
		if(name === "piece") value = parseInt(value)
		setValues({
			...values,
			[name]: value
		});
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		if(values.name === ''){
			toastr.error('', 'Nincs megadva megnevezés!');
		} else {
			props.addOrEdit(values);
		}
	};

	return(
		<>
			<form autoComplete="off" onSubmit={handleFormSubmit}>
				<div className="mb-3">
					<label htmlFor="megnevezes" className="form-label">
						Megnevezés
					</label>
					<input type="text" className="form-control" id="megnevezes" name="name"
						value={values.name}
						onChange={handleInputChange}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="mennyiseg" className="form-label">
						Mennyiség
					</label>
					<input type="number" className="form-control" id="mennyiseg" name="piece"
						value={values.piece}
						onChange={handleInputChange}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="erdemes" className="form-label">
						Itt érdemes venni: 
					</label>
					<select className="form-control" id="erdemes" name="where" onChange={handleInputChange}>
						<option value disabled selected>Válassz...</option>
						<option value="Tesco">Tesco</option>
						<option value="Lidl">Lidl</option>
						<option value="Aldi">Aldi</option>
						<option value="Spar">Spar</option>
					</select>
				</div>

				<div className="input-group">
					<input type="submit" value={props.currentId === ''? "Hozzáadás" : "Mentés"} className={props.currentId === '' ? "btn btn-primary btn-block col-md-12" : "btn btn-success btn-block col-md-12"} />
				</div>
			</form>
			<br/>
		</>
	);
}

export default InventoryForm;