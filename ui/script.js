d3.json('https://dev.universalities.com/onegrams/json_from_api/halloween.json', function(error, data){
	if(error){
		console.log(error);
	}

	d3.select('h2#data-title').text("Halloween");
	d3.select('div#data pre').html(JSON.stringify(data));
});