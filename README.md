# Witch Doctor

![witch doctor](logo.png)

a command-line tool for pulling documentation from several GitHub repositories into one project for static site generation.

## Philosophy

Documentation thrives when two rules are followed:

1. Authoring documentation occurs closest to the code it represents (hopefully in the same repo).
2. Reading documentation occurs in one common place where it can enforce a habit.

## Getting Started

First you will need to create a `witch-doctor.json` file in the directory you wish to merge documentation into. This file will look like:

```json
{
    "projects": [
        {
            "name" : "<name>",
            "source": "<source directory>",
            "target": "<target directory>",
            "repository" : "<github repository name>",
            "branch" : "<repository name>",
            "token" : "<OAuth token> (optional for private repos)"
        }
    ]
}
```

Next install the `witch-doctor` npm package.

```console
> npm install witch-doctor
> npm install -g witch-doctor
```

Finally, as part of a build, run `witch-doctor`.

```console
> witch-doctor witch-doctor.json
```

## What Happens?

Witch Doctor will clone all the repositories in your `witch-doctor.json` file and begin to copy the files from `source` to `target`. Once, all projects are processed, you can run the build script for your static site generator of choice: Jekyll, Hugo, etc.

## Credit

- [Shaman by Gan Khoon Lay (Noun Project)](https://thenounproject.com/term/shaman/659848/)