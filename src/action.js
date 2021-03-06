require('dotenv').config();
const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const TENOR_TOKEN = core.getInput('TENOR_TOKEN') || process.env.TENOR_TOKEN;
  const message = core.getInput('message') || 'Thank you!';
  let searchTerm = core.getInput('searchTerm') || 'thank you';

  if ( new Date().getMonth() === 9 ) {
    // Spooky time
    searchTerm = `spooky ${searchTerm}`;
  }

  if ( typeof TENOR_TOKEN !== 'string' ) {
    throw new Error('Invalid TENOR_TOKEN: did you forget to set it in your action config?');
  }

  if ( typeof GITHUB_TOKEN !== 'string' ) {
    throw new Error('Invalid GITHUB_TOKEN: did you forget to set it in your action config?');
  }

  const url = `https://api.tenor.com/v1/random?q=${encodeURIComponent(searchTerm)}&limit=1&media_filter=minimal&contentfilter=low`

  console.log(`Searching Tenor: ${url}`)

  const response = await fetch(`${url}&key=${TENOR_TOKEN}`);
  const { results } = await response.json();
  const gifUrl = results[0].media[0].tinygif.url;

  console.log(`Found gif from Tenor: ${gifUrl}`);

  const { context = {} } = github;
  const { pull_request } = context.payload;

  if ( !pull_request ) {
    throw new Error('Could not find pull request!')
  };

  console.log(`Found pull request: ${pull_request.number}`);

  const octokit = github.getOctokit(GITHUB_TOKEN)

  await octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: `${message}\n\n<img src="${gifUrl}" alt="${searchTerm}" />`
  });
}

run().catch(e => core.setFailed(e.message));