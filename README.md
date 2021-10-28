# Gif or Treat Action

Say thanks any time someone makes a new Pull Request on your repository!

👻 But beware of a spooky twist during the month of Halloween!

## Getting Started
* Create a [Tenor API](https://tenor.com/gifapi/documentation) key and set it as a [Secret](https://docs.github.com/en/actions/reference/encrypted-secrets) on your GitHub repo
* Add a new GitHub Action workflow:
```
name: Thank You

on:
  pull_request:
    types: [opened]

jobs:
  thanks:
    runs-on: ubuntu-latest
    steps:
      - uses: colbyfayock/gif-or-treat@main
        with:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
          TENOR_TOKEN: ${{secrets.TENOR_TOKEN}}
```
* You're welcome!
