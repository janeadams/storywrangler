d3.json("data/halloween.json").then(function(data, error) {
	console.log('read');
       if (error) 
           return console.log(error);
    d3.select('div#data').html(JSON.stringify(data.ranks));
});