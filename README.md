# customers-invitation

Read the full list of customers and output the names and user ids of matching customers (within 100km), sorted by User ID (ascending).

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Installation

``` bash
$ npm install

# or

$ yarn
```

## File Structure

1. data/customers.txt: store customers data file
1. src/cli.js: a executable file to run this test
1. src/invitation.js: Class for operating customer list
1. src/reader.js: Class for reading customer list from data file
1. src/office.js: Class for office operations, such as: store office degrees, distance between customer and office
1. __test: test cases

## Usage

### CLI
```bash
$ npm run invite

# or

$ yarn invite
```

Then output will be like:

```txt
Name: Ian Kehoe, Id: 4
Name: Nora Dempsey, Id: 5
Name: Theresa Enright, Id: 6
...
```
