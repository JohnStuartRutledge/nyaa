# Chrome Extension for Nyaa

An extension for Google Chrome that augments the anime torrent tracking site [nyaa.eu](http://nyaa.eu) with extra functionality. It keeps a list of anime you are currently watching and makes it convenient to locate new releases. 

It has the following capabailities:

- provides an options page to add new anime (you define fansubber, title, fidelity, release date)
- optionally associate [anime-planet](http://www.anime-planet.com/) anime profiles with your watched anime.
- optionally make nyaas seach default to 'english-translated anime' 
- adds a side bar containing your watch-list to the right side of the page
- highlights anime on the page that matches anime in your watch-list
- clicking on anime titles in your side bar automatically generates a search for that anime
- anime titles whose release date matches todays date, automatically get highlighted

## 3rd Party Dependencies
- [Jquery2.0.3](http://jquery.com/)
- [Jquery.tablesorter.2.0.5](http://tablesorter.com/docs/)
- [Jquery Highlight Plugin](http://bartaz.github.com/sandbox.js/jquery.highlight.html)


## TODOS
- use a reeal templating language like handlebars/mustache
- add the ability to sort sidebar anime by release date
- do not highlight episodes you have already downloaded
- optionally activate a dark theme similar to reddit enhancment suites (night mode)
- fix the settings functionality
- add convenience links to your fansubbers nyaa-user-page
- auto-convert trusted fansubber tags to links to that fansubbers home site 
- add tabs to the sidebar and place nyaas ad banner in a tab
- when anime is from a fansubber who does only raw untranslated anime ensure the url uses &cats=1_11
- ensure anime with underscores in them get highlighted
