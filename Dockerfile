FROM node:4.1.2
# Add our user and group first to make sure their IDs get assigned consistently
RUN groupadd -r app && useradd -r -g app app
 
RUN mkdir -p                 /usr/src/app
COPY package.json            /usr/src/app/
COPY index.js                /usr/src/app
COPY prometheus-mapping.json /usr/src/app

WORKDIR /usr/src/app
 
RUN npm install
 
RUN  echo "#!/bin/bash"      > /usr/src/app/start-app.sh
RUN  echo "cd /usr/src/app"  >>/usr/src/app/start-app.sh
RUN  echo "node  index.js"   >>/usr/src/app/start-app.sh
RUN  chmod +x /usr/src/app/start-app.sh
 
EXPOSE 3000
 
CMD ["/usr/src/app/start-app.sh"]
