# Sample crud application using nestJS and postgreSQL

### Project setup

#### Clone project

`git@github.com:mubasir-umbi/nestjs_sample_crud.git`

#### Setup Database

`docker run --name nest-sample -p 5432:5432  -e POSTGRES_PASSWORD=password -d postgres`

#### creane .env

`cp apps/service-main/src/.env.example apps/service-main/src/.env`

#### install dependencies

`nvm use v20`

`npm i -g @nestjs/cli`

run project
nest start service-main

