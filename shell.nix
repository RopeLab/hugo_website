with import <nixpkgs> {};

let
  pkgs_hugo = import (builtins.fetchTarball {
      url = "https://github.com/NixOS/nixpkgs/archive/0c19708cf035f50d28eb4b2b8e7a79d4dc52f6bb.tar.gz";
  }) {};
in
mkShell {
  name = "rope-lab";

  packages = [
    pkgs_hugo.hugo
    nodejs_22
    nginx
  ];
 }
