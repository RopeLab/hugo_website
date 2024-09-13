## Run in repo root

## Build react
cd ./rope-munch
npm run build
cd ..

## Copy static files
rm -rf ./static/rope-munch/static
cp -r ./rope-munch/build/static ./static/rope-munch/

## Copy html
rm ./layouts/shortcodes/rope-munch.html
cp ./rope-munch/build/index.html ./layouts/shortcodes/rope-munch.html