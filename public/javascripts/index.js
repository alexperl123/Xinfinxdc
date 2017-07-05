var account = "";

function getAccount() {
	axios.get('/api/account')
		.then(function (response) {
			account = response.data.account;
			balance();
		})
		.catch(function (e) {
			console.log(e);
	});
}

function balance() {
	axios.post('/api/balance', {
		address: account
	}).then(function (response) {
		var balance = document.getElementById("balance");
		balance.innerHTML = response.data.balance;
		}).catch(function (e) {
			var balance = document.getElementById("balance");
			balance.innerHTML = e;
	});
};

function transferToken() {
	var self = this;
	var addressTo = document.getElementById("addressTo").value;
	var value = parseInt(document.getElementById("value").value);
	axios.post('/api/transfertoken', {
		addressTo: addressTo,
		value: value
	}).then(function(response) {
		balance();
	}).catch(function(e) {
		balance();
	});
}

getAccount();
