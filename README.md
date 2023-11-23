# icomoon-pull

Simple package to pull icomoon font files to the local filesystem. This is useful if you want to use the icomoon 
fonts in your project without using the icomoon link. 

## Usage

Create .icomoonrc.json in your project root and add the icomoon links you want to download. Then run `npx icomoon-pull`.

```json
{
  "first": {
    "link": "https://i.icomoon.io/public/someThing/Project/style.css",
    "fontsPath": "path/to/fonts/icomoon/first",
    "fontsRelativePath": "../../fonts/icomoon/first",
    "styleFile": "path/to/style/icomoon/first/_init.less",
    "clean": false 
  },
  "second": {
    "link": "https://i.icomoon.io/public/other/Project/style.css",
    "fontsPath": "path/to/fonts/icomoon/second",
    "fontsRelativePath": "../../fonts/icomoon/second",
    "styleFile": "path/to/style/icomoon/second/_init.less",
    "clean": false
  }
}
```

To pull only some of the icomoon fonts, just add the name of the icomoon link to the command. E.g. `npx icomoon-pull first second`.

### Options

#### link
Type: `String`
Default value: `''`
Required: `yes`

A required string to the icomoon development css link. E.g. `https://i.icomoon.io/public/123456/myFoobarProject/style.css`

#### clean
Type: `Boolean`
Default value: `false`
Required: `no`

A true/false value to determine whether to delete the extracted icomoon sources or not. Caution: If you set 
this to true, the whole fonts folder will be deleted. 

#### fontsPath
Type: `String`
Default value: `'.'`
Required: `no`

Absolute path to your fonts folder where icomoon generated fonts will be copied.

#### fontsRelativePath
Type: `String`
Default value: `'fonts'`
Required: `no`

Relative path to your fonts folder. It should be relative to your icomoon styles file.

#### styleFile
Type: `String`
Default value: `'icomoon.css'`
Required: `no`

Absolute path to your icomoon partial file (including filename). It can be a Sass partial or vanilla CSS file.
