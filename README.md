<h1 align="center">depdown</h1>
<p align="center">
  <samp>Node.js dependency installer</samp>
</p>

### Why ?

The original code of this is from the [barelyhuman/wrap](https://github.com/barelyhuman/wrap) package and is being extracted into a sub package in case someone else would like to manage dependencies dynamically.

The sole purpose for the existence of this is to avoid having to install deps that the user might already have installed. This reduces duplication of dependencies. There is **no version check right now** which can be counterproductive but that's in the pipeline.

### Demo

You can setup an empty node package and start by adding wrap to it and running `npx wrap build` to see the installer in action.

or if this short video works for you, then that.

<p align="center"><img src="demo/depdown-demo.gif" height="300" /></p>

```sh
$ npm init -y
$ npm i -D @barelyhuman/wrap
# edit package.json to have a "source" and "main" field
$ npx wrap # will install rollup and other deps in devDeps
# or
$ npx wrap -f # will install standard in devDeps
```

### Usage

TBD

### API

TBD

### License

[MIT](/LICENSE) © Reaper
