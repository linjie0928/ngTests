class Handlers {
	public onListeningHttp: any = () => {
		console.log(`Listening on Http`);
	};

	public onListeningHttps: any = (server) => {
		return () => {
			const address = server.address();
			const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
			console.log(`Listening on ${bind}`);
		};
	};

	public onError: any = (err) => {
		console.log(err);
		process.exit(1);
	};
}

export default new Handlers();
