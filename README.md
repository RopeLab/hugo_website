# Hugo Rope Lab Website

## Setup
```shell
git submodule update --init
```
add hugo.toml file with the publishDir and hugo_cache you want to use 
```toml
baseURL = 'https://hugo.ropelab.uber.space/'
languageCode = 'de'
title = 'Social Rope Lab'
# hugo_cache = '/home/ropelab/tmp'                                # For uberspace
# publishDir = '/var/www/virtual/ropelab/hugo.ropelab.uber.space' # For uberspace
hugo_cache = './tmp'                                              # For local dev
publishDir = './result'                                           # For local dev
```

### Install rope-munch node modules
```shell
cd rope_munch
npm install
```

### Clone backend
```shell
cd ..
git clone git@github.com:RopeLab/backend.git
```



## Start full dev env
### shh tunnel database
```shell
cd ../backend &&
ssh -L 5432:127.0.0.1:5432 ropelab@betelgeuse.uberspace.de
```

### Start Backend
```shell
cd ../backend &&
cargo run
```


### Run rope-munch tailwindcss watch
```shell
cd rope_munch &&
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```

### Run rope-munch react watch
```shell
cd rope_munch &&
npm run dev-hugo
```

### Run test server
```shell
hugo server
```


## Build production
```shell
cd rope_munch 
npm run release
cd ..
hugo
```

### In uber space
```shell
sh ./scripts/build_uber.sh
```