# Chrome Extension for Nyaa

This is my personal extension for tracking and quickly navigating to my currently watched anime on [nyaa.eu](http://nyaa.eu).

It does the following things:
- provides an options screen for you to add new anime narrowed by: fansubber, title, fidelity
- auto-sets the catagory dropdown form on nyaa's homepage to the default value 'english-translated anime'
- creates a side bar containing your currently watched anime on the right side of the page
- each anime in your list automatically filters nyaa's anime to your chosen title/fansubber/quality
- each anime in your list includes a link to it's [anime-planet](http://www.anime-planet.com/) profile page
- each anime in your list includes the date the fansubber is expected to release the anime on


## 3rd Party Dependencies
- [Jquery1.8](http://jquery.com/)
- [Jquery Highlight Plugin](http://bartaz.github.com/sandbox.js/jquery.highlight.html)
- [Jquery TinysSort Plugin](http://tinysort.sjeiti.com/)

## TODOS
- when sorting anime by release date, ensure the day names are in order
- find a new sorting plugin that supports sorting on two dimensions
- use chrome local storage for storing your sort state
- only highlight episodes you have not yet downloaded
- when your anime is from a fansubber that does only raw untranslated anime make sure your url uses &cats=1_11
- change the CSS class names to something more explicit
- automatically create links out of the fansubber tags (e.g., [HorribleSubs])
  to the fansubbers home site if the fansubber is in our trusted list.
- make the dark theme an option similar to reddit enhancment suite (night mode)
- make animeplanet urls and tracking optional. If the checkbox is not activated
  the remove all animeplanet related stuff.
- change list of anime so its in a <table> element vs the current <li> element
- add color coded error messages to the message() function
- refactor the code to be more DRY. Currently you have some repetative code
  (see: instantiating a new Anime class and updating an anime)
- add links to fansubber/user page on nyaa.
- fix bug where anime that uses underscores instead of spaces in the title
  breaks the highlighting feature.
