#!/bin/bash
result=`php /root/servercheck.php`
if [ $result != true ]
then
echo "down"
tmux kill-session -t server1
tmux new -d -s server1
tmux send-keys -t server1 "npm start" C-m 
#npm stop
#npm start
fi
sleep 10

