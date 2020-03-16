#!/bin/bash
set -ex

mkdir static || true
mkdir static/assets || true
mkdir static/assets/js || true
mkdir static/assets/css || true
mkdir static/assets/aws-sdks || true


curl -s https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css -o static/assets/css/bootstrap.min.css
curl -s https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css.map -o static/assets/css/bootstrap.min.css.map

curl -s https://code.jquery.com/jquery-3.4.1.slim.min.js -o static/assets/js/jquery.min.js
curl -s https://code.jquery.com/jquery-3.4.1.slim.min.js.map -o static/assets/js/jquery.min.js.map
curl -s https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js -o static/assets/js/popper.min.js
curl -s https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js.map -o static/assets/js/popper.min.js.map
curl -s https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js -o static/assets/js/bootstrap.min.js
curl -s https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js.map -o static/assets/js/bootstrap.min.js.map



curl -s https://use.fontawesome.com/1e01bfd490.js -o static/assets/js/fontawesome.js

curl -s https://raw.githubusercontent.com/aws/aws-sdk-js/v2.36.0/dist/aws-sdk.min.js -o static/assets/aws-sdks/aws-sdk.v2.36.0.min.js
