(function (window) {

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
	//   @anime : anime object whose data will be put in the template
    var view;

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

View.prototype.renderForm = function (animeList) {
	// Take an anime model and render it's data into editiable forms
	//   @anime : anime whose data will be put in the template
    var view;

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
window.app.View = View;

//============================================================================
//============================================================================
//============================================================================

})(window);
