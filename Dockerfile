FROM node:10.24.1

MAINTAINER ABHISHEK DEY

WORKDIR /home/app

ADD . /home/app

RUN cd /home/app

RUN rm -rf package-lock.json && rm -rf node_modules && npm cache clean --force && npm i

RUN sed -i 's/127.0.0.1/edrahi-production-ro.jcnhzt.ng.0001.aps1.cache.amazonaws.com/g' /home/app/node_modules/redis/index.js

#ENV REDIS_HOST=scalbl-redis-prod-ro.a2kh38.ng.0001.aps1.cache.amazonaws.com

EXPOSE 4000

CMD ["node", "app.js"]
