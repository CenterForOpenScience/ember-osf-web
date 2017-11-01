### App code
FROM quay.io/centerforopenscience/ember-base AS app

COPY ./package.json ./yarn.lock ./.yarnrc ./
RUN yarn --frozen-lockfile

COPY ./ ./

ARG GIT_COMMIT=
ENV GIT_COMMIT ${GIT_COMMIT}

RUN yarn build --environment=production

### Dist
FROM node:8-alpine AS dist

RUN mkdir -p /code
WORKDIR /code

COPY --from=app /code/dist /code/dist

### Dev
FROM app AS dev

EXPOSE 4200

CMD ["yarn", "start"]
