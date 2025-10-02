# NestJS + Encore + Temporal Example 

This is an [Encore.ts](https://encore.dev/) + [NestJS](https://docs.nestjs.com/) example. It's a great way to learn how to combine Encore's backend 
capabilities with a modern web framework — perfect for building a web app.

[Temporal](https://docs.temporal.io/evaluate/why-temporal) is added to provider workflows as an additional capability.


## Running locally

### Setup

* Install all project dependencies
* Install [Temporal development CLI](https://learn.temporal.io/getting_started/typescript/dev_environment/#set-up-a-local-temporal-service-for-development-with-temporal-cli)
* Start the Temporal service locally in a new shell: `temporal server start-dev`

### Start service
```bash
encore run
```


You can access Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash) on <http://localhost:9400/> to view traces, API documentation, and more.

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!
