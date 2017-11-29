FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

WORKDIR $HOME/email-templates

COPY package.json $HOME/email-templates/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/email-templates

EXPOSE 3030

CMD ["npm", "start"]
