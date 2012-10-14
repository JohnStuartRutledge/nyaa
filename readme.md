# Chrome Extension for Nyaa.eu

This is my personal extension for tracking and quickly navigating to my currently watched anime.
It does the following things:
- sets the default sortby value to english-translated anime
- creates a sortable column of your currently watched anime on the right side of the page
- each anime in your list automatically filters nyaa's anime to your chosen title/fansubber/quality
- each anime in your list includes a link it's anime-planet profile page
- each anime in your list includes the date the fansubber is expected to release the anime on

## Temporary Requirements
- I'm temporarily using the [Minimalist](https://chrome.google.com/webstore/detail/minimalist-for-everything/bmihblnpomgpjkfddepdpdafhhepdbek) plugin for Google Chrome to run this plugin, until I can create a proper Chrome plugin myself. 
- For the moment I'm storing informaiton about the anime i'm watching within a javascript object. 

## 3rd Party Dependencies
- [Jquery1.8](http://jquery.com/)
- [Jquery Highlight Plugin](http://bartaz.github.com/sandbox.js/jquery.highlight.html)
- [Jquery TinysSort Plugin](http://tinysort.sjeiti.com/)

## TODOS
- turn this file into a Chrome extension
- when sorting anime by release date, ensure the day names are in order
- find a new sorting plugin that supports secondary sorting AKA sorting on two dimensions
- create a settings area for adding and removing anime
- only highlight episodes you have not yet downloaded
- when your anime is from a fansubber that does only raw untranslated anime make sure your url uses &cats=1_11
- render links to the major fansubbers websites, as well as to animedb and animenetwork's upcoming page
- change your CSS class names to something more explicit

