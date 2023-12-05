# 2023 Advent of Code

Language: JavaScript/Node.js (no 3rd party dependencies)

There is a shared helper script that automatically downloads inputs, but it requires your adventofcode.com session cookie value to work.

## Setup:

1. Ensure Node.js is installed (a decently recent version should work, or you can setup [NVM](https://github.com/nvm-sh/nvm))
2. Run `cp ./.env.example .env`
3. Visit <https://adventofcode.com/2023/day/1/input> (complete the necessary sign-in steps for Advent of Code on their website)
4. Open your browser dev tools, go to "Application", then "Cookies"
5. Copy the value for the cookie named "session"
6. Paste the value inside `./.env` over `<Cookie-Session-Value>`

An alternative to copying cookies is to paste input text in files of the form `./.cache/input-1.txt`, and so on.

## To Run:

Execute the following:

```bash
node day-1.mjs
```

Additional note: Each file has the example input comented out. You can swap definitions of `const input` to switch between the on-page example and your specific full input.

For fun, to run all days, paste the following in your shell:

```bash
for FILE in day-*.mjs; do echo $FILE; node $FILE; done
```
