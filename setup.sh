#!/bin/bash

# default setting
REFRESH_INTERVAL=1800
COLLECT_INTERVAL=10

usage() {
    echo "syntax: $0 [options] <root_dir> <node_addr> <chain_id>"
    echo "options:"
    echo "  -rit  refresh interval"
    echo "  -cit  collect interval"
    echo "  -h    print usage"
}

while getopts "ritcit:h" arg; do
    case $arg in
        rit)
            REFRESH_INTERVAL=$OPTARG
            ;;
        cit)  
            COLLECT_INTERVAL=$OPTARG
            ;;
        h | *)
            usage
            exit
            ;;
    esac
done

shift $(( OPTIND - 1 ))

ROOT_DIR=$1
NODE_ADDR=$2
CHAIN_ID=$3

if [-z "$ROOT_DIR" -o -z "$NODE_ADDR" -o -z "$CHAIN_ID" ]; then
    usage
    exit 1
fi

echo "root dir  = $ROOT_DIR"
echo "node addr = $NODE_ADDR"
echo "chain id  = $CHAIN_ID"

# copy server, db dirs to /root/explorer/server
mkdir -p $ROOT_DIR
cp -ra ./server/ ./db/ $ROOT_DIR 

# server/api
cp -f ./misc/exp-api.service.in exp-api.service
sed -e s/@ROOT_DIR@/$ROOT_DIR/ -i.tmp exp-api.service
mv -f exp-api.service /etc/systemd/system/
npm install --prefix $ROOT_DIR/server/api

# server/crawler/collector
cp -f ./misc/crawler-collector.service.in crawler-collector.service
sed -e s/@ROOT_DIR@/$ROOT_DIR/ -i.tmp crawler-collector.service
sed -e s/@NODE_ADDR@/$NODE_ADDR/ -i.tmp crawler-collector.service
mv -f crawler-collector.service /etc/systemd/system/crawler-collector.$CHAIN_ID.service

# server/crawler/builder
cp -f ./misc/crawler-builder.service.in crawler-builder.service
sed -e s/@ROOT_DIR@/$ROOT_DIR/ -i.tmp crawler-builder.service
sed -e s/@CHAIN_ID@/$CHAIN_ID/ -i.tmp crawler-builder.service
mv -f crawler-builder.service /etc/systemd/system/crawler-builder.$CHAIN_ID.service

# server/crawler/nodes
cp -f ./misc/crawler-nodes.service.in crawler-nodes.service
sed -e s/@ROOT_DIR@/$ROOT_DIR/ -i.tmp crawler-nodes.service
sed -e s/@CHAIN_ID@/$CHAIN_ID/ -i.tmp crawler-nodes.service
sed -e s/@NODE_ADDR@/$NODE_ADDR/ -i.tmp crawler-nodes.service
sed -e s/@REFRESH_INTERVAL@/$REFRESH_INTERVAL/ -i.tmp crawler-nodes.service
sed -e s/@COLLECT_INTERVAL@/$COLLECT_INTERVAL/ -i.tmp crawler-nodes.service
mv -f crawler-nodes.service /etc/systemd/system/crawler-nodes.$CHAIN_ID.service