const url = 'https://map-places.p.rapidapi.com/queryautocomplete/json?input=pizza%20near%20Sydney&radius=50000';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '080f4ef5cfmsh1bc3dcd3a9de26ap1dd994jsnebba317159df',
		'X-RapidAPI-Host': 'map-places.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}

