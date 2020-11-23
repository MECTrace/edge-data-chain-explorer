#!/bin/sh

if [ -z "$NODE_ADDR" -o -z "$CHAIN_ID" ]; then
    echo "Environment variable 'NODE_ADDR' or 'CHAIN_ID' is not given"
    exit 1
fi

if [ -z "$REFRESH_INTERVAL" ]; then
    REFRESH_INTERVAL=1800
fi

if [ -z "$COLLECT_INTERVAL" ]; then
    COLLECT_INTERVAL=10
fi

echo "node addr        = $NODE_ADDR"
echo "chain id         = $CHAIN_ID"
echo "refresh interval = $REFRESH_INTERVAL"
echo "collect interval = $COLLECT_INTERVAL"

./collector.py --node $NODE_ADDR --limit 0 &
status=$?
if [ $status -ne 0 ]; then
    echo "Failed to start collector.py: $status"
    exit $status
fi

./builder.py --chain $CHAIN_ID --limit 0 &
status=$?
if [ $status -ne 0 ]; then
    echo "Failed to start builder.py: $status"
    exit $status
fi

./nodes.py --chain $CHAIN_ID --targets $NODE_ADDR -rit $REFRESH_INTERVAL -cit $COLLECT_INTERVAL &
status=$?
if [ $status -ne 0 ]; then
    echo "Failed to start nodes.py: $status"
    exit $status
fi

while sleep 30; do
    ps aux | grep collector.py | grep -q -v grep
    COLLECTOR_STATUS=$?
    ps aux | grep builder.py | grep -q -v grep
    BUILDER_STATUS=$?
    ps aux | grep nodes.py | grep -q -v grep
    NODES_STATUS=$?
    if [ $COLLECTOR_STATUS -ne 0 -o $BUILDER_STATUS -ne 0 -o $NODES_STATUS -ne 0 ]; then
        echo "One of the processes has already exited."
        exit 1
    fi
done
