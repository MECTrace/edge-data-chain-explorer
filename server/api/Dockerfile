# vim: set expandtab:

# base image
FROM node:12.18.1-alpine3.11

# set working dir
WORKDIR /app

# copy necessary elements
COPY bin/ /app/bin/
COPY db/ /app/db/
COPY models/ /app/models/
COPY routes/ /app/routes/
COPY app.js config.js package.json package-lock.json swaggerDef.js /app/

# install package.json
RUN npm install

# volume
VOLUME /db/config.json

# run app
CMD ["npm", "run", "start"]
