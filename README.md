
# Hugo Rope Lab Website

## Setup
add hugo.toml file with the publishDir and hugo_cache you want to use 
```toml
baseURL = 'https://hugo.ropelab.uber.space/'
languageCode = 'de'
title = 'Social Rope Lab'
# hugo_cache = '/home/ropelab/tmp'
# publishDir = '/var/www/virtual/ropelab/hugo.ropelab.uber.space'
hugo_cache = './tmp'
publishDir = './result'
```

## Build
### In dev
```shell
hugo
```

### In uber space 
```shell
sh ./scripts/build_uber.sh
```