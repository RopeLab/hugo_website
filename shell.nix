with import <nixpkgs> {};

mkShell {
  name = "rope-lab";
  packages = [
    hugo
  ];
 }
