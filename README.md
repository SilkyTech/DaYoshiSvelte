# Dayoshi
Now this is a repo only a few people can access.
If you can see this then I trust you with the code access.

# Setting up
If it is your first time, then run these steps:
## Initializing the git repo
Create a new folder in your computer.
I'll use linux commands but use windows if you are on that.
```sh
mkdir dayoshi
cd dayoshi
git init
```
This will setup your git repo.
> Download `git` on your computer if this doesn't work - https://git-scm.com/downloads - when there is an error in console saying: 'git' is not recognized as an internal or external command.

## Pulling from Github
When you have initialized the repo then do this:
```sh
git remote add origin https://github.com/SilkyTech/DaYoshiSvelte.git
git pull origin main
```
This will start pulling the code from Github.
> If it doesn't work you will have to authenticate your git.
> Use your username and put your password as your PST
> https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
> A VPN may be required because it is likely for the request to time out
## After downloading the server
Run `yarn` in the folder to download all the packages.
> If that doesn't exist then download it from `npm`- from node.js here: https://nodejs.org/en/download/ - if there is an error in console saying: 'yarn' is not recognized as an internal or external command.

## Launching the app
To run the server locally, run `yarn run dev`.
> If it gives you an error about nodemon not being installed then run `npm i nodemon -g`.
> You may need to give it sudo permissions.
If you want to host it on the local network then use `yarn run dev --host`

# BUGS
This is still a buggy website, with some teething issues.
Make sure to use the `Issues` tab if you find any :)
[Issues Tab](https://github.com/SilkyTech/DaYoshiSvelte/issues)

## Known bugs
  > The `Shiny Yoshi Pet` has ridiculous attack damage variation.
  
  > Box opening has weird animations and no select box sometimes.


## WONT FIX LL
> Clicks are not registering in some browsers. - POTENTIAL FIX ON THE WAY

> The pet menu has redonkulously long scroll or empty spaces.
