FROM node:16.15.1-alpine3.16
#NODE_VERSION=16.15.1

ENV TZ=Asia/Makassar 
# NEXT_PUBLIC_PROTOCOL_API=https NEXT_PUBLIC_HOST_API=pst-api.bpskolaka.com NEXT_PUBLIC_PROTOCOL_SOCKET=https NEXT_PUBLIC_HOST_SOCKET=pst-api-socket.bpskolaka.com
# NEXT_PUBLIC_PORT_API=3000 NEXT_PUBLIC_PORT_SOCKET=98

WORKDIR /app

COPY . /app/

RUN npm install --force

RUN npm run build

EXPOSE 83

CMD ["npm", "start"]

#docker build . -t antrian-pst-lacak