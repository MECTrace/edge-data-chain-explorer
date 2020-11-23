# vim: set expandtab:

# base image
FROM python:3.8.3-alpine3.11

# set working dir
WORKDIR /app

# copy necessary elements
COPY * /app/

# install requirements.txt
RUN pip3 install -r requirements.txt

# set volumes
VOLUME /db/config.json
VOLUME /var/tmp/

# run app
CMD ["./docker-entrypoint.sh"]
