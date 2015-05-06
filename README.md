
# eDM Starter Kit

Includes a sass version of Ink (http://zurb.com/ink/docs.php).

Campaign Monitor template reference: https://www.campaignmonitor.com/create/
Mailchimp template reference: http://templates.mailchimp.com/getting-started/template-language/


## Installation

```
bundle install
bower install
npm install
```

(Ruby and Bundler must be installed: `gem install bundler`)

Copy `credentials.example.json` to `credentials.json` and enter any relevant details.

## Dev

```
gulp
```

Starts a server with browsersync in the `/dist` directory: `http://localhost:3000` 

`/styles/styles.scss` is compiled to `/styles/styles.css`


## Build

```
gulp build
```

CSS is inlined using Premailer
Images are optimised using Imagemin
HTML and images are saved to the `/dist` directory

## Testing

```
gulp test

gulp test --emails="email@tundra.com.au"
gulp test --emails="email1@tundra.com.au,email2@tundra.com.au"

gulp test --subject="..."
```

**S3**
Before sending a test to Litmus or an email address, all image are uploaded to S3 and all `images/` paths are changed in the html.

AWS credentials are set in `credentials.json`.

**Litmus**
If `gulp test` is called without the `emails` argument then it is sent to Litmus using the API. Subsequent tests are created as new versions not new tests.

Litmus API details are set in `credentials.json`.
Theres is also a complete list of all possible email clients for the `litmus.applications` array in `litmus_clients.json`.

**Email**
If `gulp test` is called with the `emails` argument then an email is sent to each comma-separated address provided using the Mailgun API.

Mailgun API details are set in `credentials.json`.

**Subject**
The email subject line is set in this order:

1. The `subject` argument passed to `gulp test`
2. The `subject` property in `package.json`
3. The `name` property in `package.json`
