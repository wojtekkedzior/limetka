FROM ubuntu


RUN mkdir -p /limetka-ui/build
RUN mkdir /limetka-backend

COPY entrypoint.sh /entrypoint.sh
COPY ui/build/ /limetka-ui/build
COPY backend/backend /limetka-backend

RUN chmod 775 /entrypoint.sh

RUN apt update && apt install -y curl uuid-runtime imagemagick
RUN curl -sL  https://deb.nodesource.com/setup_16.x | bash -
RUN apt update && apt install -y nodejs

#RUN uuidgen
#RUN npm --version
#RUN node --version
RUN npm install -g serve

EXPOSE 3000
EXPOSE 3001

ENTRYPOINT ["/entrypoint.sh"]