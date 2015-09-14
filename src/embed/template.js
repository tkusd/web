'use strict';

var app = new Framework7({
  material: {% if project.get('theme') == 'material' %}true{% else %}false{% endif %},
  modalTitle: {{ project.get('title') | stringify }},
  modalCloseByOutside: true
});

var view = app.addView('.view-main');
var viewContents = {};

{% for view in views %}
viewContents[{{ view.key | stringify }}] = {{ view.markup | stringify }};
{% endfor %}

{% for event in events %}
Dom7(document).on({{ event.get('event') | stringify }}, '#e{{ event.get("element_id") }}', function(){
  {{ event.get('code') }}
});
{% endfor %}

{% if project.get('main_screen') %}
view.router.load({
  content: viewContents[{{ project.get('main_screen') | stringify }}],
  animatePages: false
});
{% endif %}