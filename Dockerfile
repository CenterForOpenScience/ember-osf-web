### App code
FROM quay.io/centerforopenscience/ember-base-14 AS app

COPY ./package.json ./yarn.lock ./.yarnrc ./
RUN yarn --frozen-lockfile

COPY ./ ./

ARG ASSETS_BRANCH='master'
ARG GIT_COMMIT=

ENV GIT_COMMIT=${GIT_COMMIT}

RUN git clone https://github.com/CenterForOpenScience/osf-assets.git ./public/assets/osf-assets/ \
        --branch ${ASSETS_BRANCH} \
        --single-branch \
    && yarn build --environment=production

### Dist
FROM node:14-alpine AS dist

RUN mkdir -p /code
WORKDIR /code

COPY --from=app /code/dist /code/dist

### Dev
FROM app AS dev

EXPOSE 4200

CMD ["yarn", "start"]
