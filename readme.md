# Chrome Extension for Nyaa

An extension for Google Chrome that augments the anime torrent tracking site [nyaa.se](http://nyaa.se) with extra functionality. It keeps an editable list of your watched anime making it convenient to locate new releases. 

It has the following capabailities:

- provides an options page to add new anime (fansubber, title, fidelity, release date)
- adds a side bar containing your watch-list to the right side of the page
- clicking on titles in the side bar automatically searches nyaa for that title 
- optionally associate [anime-planet](http://www.anime-planet.com/) anime profiles with your watched anime.
- optionally make nyaas seach default to 'english-translated anime' 
- highlights anime on the page that matches anime in your watch-list
- highlights anime in the side bar whose release date matches todays date

## 3rd Party Dependencies
- [Jquery2.0.3](http://jquery.com/)
- [Jquery.tablesorter.2.0.5](http://tablesorter.com/docs/)
- [Jquery.regex.extend](https://gist.github.com/Mottie/461488)

## TODOS

- add the ability to sort sidebar anime by release date
- do not highlight episodes you have already downloaded
- add convenience links to your fansubbers nyaa-user-page
- auto-convert trusted fansubber tags to links to that fansubbers home site 
- add tabs to the sidebar and place nyaas ad banner in a tab
- add settings for filtering out anime by a min-max size 
- when anime is from a fansubber who does only raw untranslated anime ensure the url uses &cats=1_11

## On The Horizon
- convert app to backbone.js + requie.js 
- use handlebars for templating 
- use [lawnchair](brian.io/lawnchair/) with the chrome-storage adapter to manage localstorage
- integrate [myanimelist](http://myanimelist.net/) into the project

