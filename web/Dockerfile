# vim: set expandtab:

# base builder image
FROM node:12.18.1-alpine3.11

# set working dir
WORKDIR /app

# copy necessary elementes
COPY package.json tsconfig.json yarn.lock /app/
COPY public /app/public/
COPY src/ /app/src/

# install package.json
RUN yarn install

# build app
RUN yarn build

####

# base runner image
FROM node:12.18.1-alpine3.11

# install serve 
RUN npm install -g serve

# copy built artifacts
COPY --from=0 /app/build /app/

# set working dir
WORKDIR /

# expose default port for serving app
EXPOSE 5000

# run app
CMD ["serve", "-s", "app"]
