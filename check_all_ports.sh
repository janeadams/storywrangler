#! /usr/bin/bash
shopt -s expand_aliases
source /home/janeadams/.bashrc

if lsof -i:3000
then
	echo dev-api is running
else
	echo dev-api is not running
	rm -f dev/api/logs/*.csv && . activate test_env && touch dev/api/logs/querylog.csv && touch dev/api/logs/responselog.csv && python3 dev/api/init_logs.py && nohup uwsgi --http :3000 --wsgi-file dev/api/uwsgi.py > debug/dev-api.text & disown
fi

if lsof -i:3001
then
	echo prod-api is running
else
	echo prod-api is not running
	rm -f prod/api/logs/*.csv && . activate test_env && touch prod/api/logs/querylog.csv && touch prod/api/logs/responselog.csv && python3 prod/api/init_logs.py && nohup uwsgi --http :3000 --wsgi-file prod/api/uwsgi.py > debug/prod-api.text & disown
fi

if lsof -i:8051
then
	echo dev-ui is running
else
	echo dev-ui is not running
	nohup node dev-ui-server.js > debug/dev-ui.txt & disown
fi

if lsof -i:8050
then
	echo prod-ui is running
else
	echo prod-ui is not running
	nohup node prod-ui-server > debug/prod-ui.txt & disown
fi
