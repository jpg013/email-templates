FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

RUN cd /usr/local/share

RUN apt-get update
RUN apt-get install build-essential chrpath libssl-dev libxft-dev
RUN apt-get install libfreetype6 libfreetype6-dev
RUN apt-get install libfontconfig1 libfontconfig1-dev
RUN wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2

#RUN mv phantomjs-2.1.1-linux-x86_64.tar.bz2 /usr/local/share
#RUN cd /usr/local/share

RUN ls -a

RUN tar xvjf phantomjs-2.1.1-linux-x86_64.tar.bz2

RUN ln -sf /usr/local/share/phantomjs-2.1.1-linux-x86_64.tar.bz2/bin/phantomjs /usr/local/share/phantomjs
RUN ln -sf /usr/local/share/phantomjs-2.1.1-linux-x86_64.tar.bz2/bin/phantomjs /usr/local/bin/phantomjs
RUN ln -sf /usr/local/share/phantomjs-2.1.1-linux-x86_64.tar.bz2/bin/phantomjs /usr/bin/phantomjs

RUN cd ~/

# Force PhantomJs to use the global installed version instead of the one placed in node_modules
RUN ENV PHANTOMJS_BIN /usr/local/bin/phantomjs


WORKDIR $HOME/email-templates

COPY package.json $HOME/email-templates/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/email-templates

EXPOSE 3000

CMD ["npm", "start"]
