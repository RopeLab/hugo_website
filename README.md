
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

## Dev env
### Run test server
```shell
hugo server
```

### Build
```shell
hugo
```


## In uber space 
### Build
```shell
sh ./scripts/build_uber.sh
```