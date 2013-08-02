(function (NyaaJS) {

//============================================================================
//============================================================================
//============================================================================

function View() {
	// Sets up the View constructor and stores the default templates

	this.animeTableTemplate 
	= '<tr data-anime-id="{{ animeID }}" class="anime_info_mode">'
	+   '<td>{{ fansubber }}</td>'
	+   '<td>{{ title }}</td>'
	+   '<td>{{ fidelity }}</td>'
	+   '<td>{{ air_day }}</td>'
	+   '<td>{{ animeplanet }}</td>'
    +   '<td><button>edit</button></td>'
	+ '</tr>';

    this.animeSidebarTemplate
    = '<div id="nyaajs_showtimes">'
    +   '<a id="nyaajs_btn_add" href="{{ options_pg }}">add anime</a>'
    +   '<a id="nyaajs_btn_sort">sort me</a>'
    +   '<table>'
    +     '<thead>'
    +       '<tr>'
    +          '<th>title</th>'
    +          '<th>air day</th>'
    +          '<th>animeplanet</th>'
    +       '</tr>'
    +     '</thead>'
    +     '<tbody>{{ anime_rows }}</tbody>'
    +   '</table>'
    + '</div>';

    this.animeRowsTemplate
    = '<tr>'
    +   '<td><a class="nyaajs_anime" href="{{ url }}">{{ title }}</a></td>'
    +   '<td class="nyaajs_anime_airday">{{ air_day }}</td>'
    +   '<td><a class="nyaajs_anime_planet" href="{{ animeplanet }}" target="_blank">A</a></td>'
    + '</tr>';

	this.animeFormTemplate
	= '<tr data-anime-id="{{ animeID }}" class="anime_edit_mode">'
	+    '<td><input type="text" class="form_fansubber" value="{{ fansubber }}"></td>'
    +    '<td><input type="text" class="form_title" value="{{ title }}"></td>'
    +    '<td>'
    +      '<select class="form_fielity">'
    +        '<option>none</option>'
    +        '<option>480p</option>'
    +        '<option>720p</option>'
    +        '<option>1080p</option>'
   	+      '</select>'
   	+    '</td>'
    +    '<td>'
    +      '<select class="form_air_day">'
    +        '<option>?</option>'
    +        '<option>mon</option>'
    +        '<option>tue</option>'
    +        '<option>wed</option>'
    +        '<option>thu</option>'
    +        '<option>fri</option>'
    +        '<option>sat</option>'
    +        '<option>sun</option>'
   	+      '</select>'
   	+    '</td>'
   	+    '<td><input type="text" class="form_animeplanet" value="{{ animeplanet }}"></td>'
   	+    '<td>'
    +      '<button>update</button>'
    +      '<button class="danger">delete</button>'
    +      '<button>cancel</button></td>'
   	+    '</td>'
	+ '</tr>';
}

View.prototype.renderTable = function (animeList) {
	// Take an anime model and render it's data into a template
	//   @animeList : anime objects whose data will be put in the template
    var view = '';

    for (i=0, len=animeList.length; i<len; i++) {
        var template = this.animeTableTemplate;
        var anime    = animeList[i];

    	template = template.replace('{{ animeID }}',     anime.id);
    	template = template.replace('{{ fansubber }}',   anime.fansubber);
    	template = template.replace('{{ title }}',       anime.title);
    	template = template.replace('{{ fidelity }}',    anime.fidelity);
    	template = template.replace('{{ air_day }}',     anime.air_day);
    	template = template.replace('{{ animeplanet }}', anime.animeplanet);

        view += template;
    }
    return view;
};

View.prototype.renderRows = function (animeList) {
    // Take an anime model and render it's data into a <tr> items
    //  @animeList : the list of anime to convert to into rows
    var view = '';

    for (i=0, len=animeList.length; i<len; i++) {
        var template = this.animeRowsTemplate;
        var anime    = animeList[i];

        template = template.replace('{{ url }}',         anime.url);
        template = template.replace('{{ title }}',       anime.title);
        template = template.replace('{{ air_day }}',     anime.air_day);
        template = template.replace('{{ animeplanet }}', anime.animeplanet);

        view += template;
    }
    return view;
};

View.prototype.renderSidebar = function (animeList) {
    // Take an anime model and reder it's data into a list item
    //  @animeList : the list of anime to convert to <tr> items
    var template = this.animeSidebarTemplate;
    var rows = this.renderRows(animeList);

    template = template.replace('{{ options_pg }}', chrome.extension.getURL("options.html"));
    template = template.replace('{{ anime_rows }}', rows);
    return template;
};

View.prototype.renderForm = function (animeList) {
	// Take an anime model and render it's data into editiable forms
	//   @animeList : anime objects whose data will be put in the template
    var view = '';

    for (i=0, len=animeList.length; i<len; i++) {
        var template = this.animeFormTemplate;
        var anime    = animeList[i];

    	if (anime.fidelity) {
            template = template.replace('<option>'+anime.fidelity,
                '<option selected="selected">'+anime.fidelity);
    	}
    	if (anime.air_day) {
            template = template.replace('<option>'+anime.air_day,
                '<option selected="selected">'+anime.air_day);
    	}
        template = template.replace('{{ animeID }}',     anime.id);
    	template = template.replace('{{ fansubber }}',   anime.fansubber);
    	template = template.replace('{{ title }}',       anime.title);
    	template = template.replace('{{ animeplanet }}', anime.animeplanet);

        view += template;
    }
    return view;
};


// Export to window
NyaaJS.View = View;

//============================================================================
//============================================================================
//============================================================================

})(NyaaJS);
