#!/bin/sh
yarn
yarn build
cp favicon.ico fav.ico
mv fav.ico dist/favicon.ico