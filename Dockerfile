# create image based on official node 6 image from Docker
FROM node:8

# set environment
ENV NPM_CONFIG_LOGLEVEL warn
ARG env
ENV NOTE_ENV $env

# add volume
ADD . /code

# move to app dir
WORKDIR /code

EXPOSE 4000

# install dependencies for app
# COPY package.json package.json
# COPY npm-shrinkwrap.json npm-shrinkwrap.json
RUN yarn install


# run app
CMD [ -f "/bin/bash" ] && if [ ${NODE_ENV} = production ]; \
  then \
  yarn build; \
  else \
  yarn start; \
  fi


