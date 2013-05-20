# Chrome Extension for Nyaa

This is my personal extension for tracking and quickly navigating to my currently watched anime on [nyaa.eu](http://nyaa.eu).

It does the following things:
- provides an options screen for you to add new anime narrowed by: fansubber, title, fidelity
- auto-sets the catagory dropdown form on nyaa's homepage to the default value 'english-translated anime'
- creates a side bar containing your currently watched anime on the right side of the page
- each anime in your list automatically filters nyaa's anime to your chosen title/fansubber/quality
- each anime in your list includes a link it's [anime-planet](http://www.anime-planet.com/) profile page
- each anime in your list includes the date the fansubber is expected to release the anime on


## 3rd Party Dependencies
- [Jquery1.8](http://jquery.com/)
- [Jquery Highlight Plugin](http://bartaz.github.com/sandbox.js/jquery.highlight.html)
- [Jquery TinysSort Plugin](http://tinysort.sjeiti.com/)

## TODOS
- when sorting anime by release date, ensure the day names are in order
- find a new sorting plugin that supports secondary sorting AKA sorting on two dimensions
- only highlight episodes you have not yet downloaded
- when your anime is from a fansubber that does only raw untranslated anime make sure your url uses &cats=1_11
- render links to the major fansubbers websites, as well as to animedb and animenetwork's upcoming page
- change your CSS class names to something more explicit

