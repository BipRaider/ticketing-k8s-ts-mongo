FROM node:alpine
# Add the following lines
ENV CI=true
ENV WDS_SOCKET_PORT=0
ENV WATCHPACK_POLLING=true

WORKDIR /opt/app
COPY package*.json ./
RUN npm i
ADD . .
CMD ["npm", "start"]

