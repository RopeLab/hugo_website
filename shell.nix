with import <nixpkgs> {};

let
    pkgs_hugo = import (builtins.fetchTarball {
        url = "https://github.com/NixOS/nixpkgs/archive/05bbf675397d5366259409139039af8077d695ce.tar.gz";
    }) {};
in
mkShell {
  name = "rope-lab";

  packages = [
    pkgs_hugo.hugo
    nodejs_22
  ];
 }
