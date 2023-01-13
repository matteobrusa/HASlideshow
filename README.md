# HASlideshow
_A background slideshow for your [Home Assistant](https://www.home-assistant.io/) dashboard._

This script shows random photos from [Picsum](https://picsum.photos/) or your own collection as a background for your HA dashboard.

Useful to show your preferred dashboard on a spare, always on tablet.

![image](https://user-images.githubusercontent.com/6077747/211050427-c9e45de1-78a8-450d-93d6-7dc2527cd515.png)


## Manual install
Download the `background_slideshow.js` script and place it into the `www/HASlideshow` folder of your Home Assistant installation.

In Home Assistant, navigate to `Settings` > `Dashboards`, open the three-dots menu and select `resources`; alternatively, point your browser to `/config/lovelace/resources`.

Add a new resouce as a _javascript module_ pointing to the `/local/HASlideshow/background_slideshow.js` URL.

## Basic config
HASlideshow only updates the background image in dashboards that have one. If you don't have a background yet, use the `Raw configuration editor` and add one:
```
views:
  - theme: xxxx
    title: xxxx
    background: center / cover no-repeat fixed url('/local/bg.jpg')
```
It's ok if you don't have the picture `bg.jpg`.

HASlideshow loads the first image after 5 seconds.
By default, the background changes every minute; to change the duration, edit the constant `updateInterval` in `background_slideshow.js`.

## Features
Double tap anywhere on the screen to skip to the next image. 

### Show your own images
1. Create a `backgrounds` folder under `www/HASlideshow`
2. Drop your images there
3. Rename the images according to the following naming convention:
```
0.jpg
1.jpg
...
```
Make sure that the numerical sequence has no gaps.
You can force the script to use picsum images and ignore the local images by appending `&force_picsum` to the URL


# Troubleshooting
Any change to the script or the content of the `www` folder might require to clear the cache of your browser or the companion app. 
