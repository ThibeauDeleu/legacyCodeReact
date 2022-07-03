/*jshint esversion: 8 */

let API = (() => {

	const api_path = 'localhost';
	const api_port = 5001;
	const base_url = window._env_.REACT_APP_APIurl;

	let get = async function (path: string): Promise<any> {
		let full_path: URL = new URL(`${base_url}/${path}`);
		return await fetch(`${full_path}`, {
			method: 'GET',
			cache: 'no-cache',
			mode: 'cors',
		})
			.then((data) => {
				if (data.status === 404) {
					throw Error('Could not get data, not found.');
				}
				return data.json();
			})
			.catch((err) => {
				console.error('Something went wrong: ', err);
				throw err;
			});
	};

	let post = async function (path: string, body: Object): Promise<any> {
		let full_path: URL = new URL(`${base_url}/${path}`);
		return await fetch(`${full_path}`, {
			method: 'POST',
			// mode: "cors",
			// cache: "no-cache",
			headers: {
				'Content-Type': 'application/json',
				// "Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify(body),
		})
		.then((data) => {
				if (data.status === 422) {
					throw Error('A field is missing');
				}
				return data.json();
			})
			.catch((err) => {
				console.error('Something went wrong: ', err);
				throw err;
			});
	};

	let put = async function (path: string, body: Object): Promise<any> {
		let full_path: URL = new URL(`${base_url}/${path}`);
		return await fetch(`${full_path}`, {
			method: 'PUT',
			// mode: "cors",
			// cache: "no-cache",
			headers: {
				'Content-Type': 'application/json',
				// "Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify(body),
		})
			.then((data) => {
				if (data.status === 404) {
					throw Error('Could not get data, not found.');
				}else if (data.status === 400) {
					throw Error('Something went wrong while updating');
				}
				return data.json();
			})
			.catch((err) => {
				console.error('Something went wrong: ', err);
				throw err;
			});
	};

	let del = async function (path: string, body: string): Promise<any> {
		let full_path: URL = new URL(`${base_url}/${path}`);
		const bodyData = {
			uuid: body
		}
		console.log(JSON.stringify(body))
		return await fetch(`${full_path}`, {
			method: 'DELETE',
			// mode: "cors",
			// cache: "no-cache",
			headers: {
				'Content-Type': 'application/json',
				// "Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify(bodyData),
		}).then((data) => {
				if (data.status === 404) {
					throw Error('Could not get data, not found.');
				}else if (data.status === 400) {
					throw Error('Something went wrong while updating');
				}
				return data.json();
			})
			.catch((err) => {
				console.error('Something went wrong: ', err);
				throw err;
			});
	};

	let api = {
		base_url: base_url,
		get: get,
		post: post,
		put: put,
		delete: del,
	};

	return api;
})();

export default API;
