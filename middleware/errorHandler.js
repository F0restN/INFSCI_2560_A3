function statusHandler(req, res, statusCode, data) {
	let responseBody = {
		statusCode: statusCode,
		mssg: "Unconfirmed",
		data: data ? data : [],
	};
	switch (statusCode) {
		case 200:
			responseBody.mssg = "Great, successfully handled";
			break;
		case 201:
			responseBody.mssg = "Great, successfully created";
			break;
		case 400:
			responseBody.mssg =
				"Bad request, server cannot process, please check query body";
			break;
		case 404:
			responseBody.mssg = "Not found, request item doesnt exist";
			break;
		case 500:
			responseBody.mssg = "Internal Server error";
			break;
	}

	res.json(responseBody);
	res.end();
}

module.exports = { statusHandler };
