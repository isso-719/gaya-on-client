#!/bin/bash

# package.json のバージョン変更をしたかどうかを確認する
echo "package.json のバージョンを変更しましたか？ (y/n)"
read answer
if [ $answer != "y" ]; then
  echo "package.json のバージョンを変更してください"
  exit 1
fi

# GitHub に push する
echo "バージョンを入力してください (例: v1.0.0)
read version
git add .
git commit -m $version
git tag $version
git push && git push --tags