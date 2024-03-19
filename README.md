# React/Bootstrap/Capacitor Example

Base project using:

- reactjs
- capacitorjs
- bootstrap, react-bootstrap, react-bootstrap-icons

## Getting started

Install dependancies
npm i

Add Capcitor Types
npx cap add android

(or ios)

Start (web) project
npm start

Open Android Studio with Project
npx cap open android

Sync files between vs code project and android studio
npm run sync

To run the app in Android Studio - click run button

### Simple change to see effect

in the .env file you can change the brand name to see impact of chnages

A .env file change needs a new
npm start
npm run sync

to be visible

## Requires

Android Studio for Android Dev
iOS should be supported but not used by the developer

## Commands

npm start - starts in browser

npm run sync - builds project and syncs to Android Studio

## Styling

<https://react-bootstrap.github.io/docs/getting-started/introduction>
<https://getbootstrap.com/docs/5.3/customize/overview/>

check app.scss as an example

Current Overrides - border for checkboxes and inputs, primary color

## Creating a Splash Sceen

Provide icon and splash screen source images using this folder/filename structure:

resources/
├── icon-only.png
├── icon-foreground.png
├── icon-background.png
├── splash.png
└── splash-dark.png

<https://capacitorjs.com/docs/guides/splash-screens-and-icons>

npx capacitor-assets generate

## Bootstrap examples

Taken from: <https://getbootstrap.com/docs/5.0/examples/>

## Design Elements

Taken from: <https://react-bootstrap.github.io/>


# Push Notifications

<https://medium.com/@avilaatencioa/ionic-capacitor-push-notifications-9dc248e59357>

Note: app name in google-services and capacitor config must match
za.co.cairnsgames.app

NOTE google-services is not copied on sync
copy to adroid/app directory
