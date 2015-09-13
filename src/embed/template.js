'use strict';

var app = new Framework7({
  material: {% if project.get('theme') == 'material' %}true{% else %}false{% endif %},
  modalTitle: {{ project.get('title') | stringify }},
  modalCloseByOutside: true
});

var view = app.addView('.view-main');

{% for view in views %}
var v_{{ view.key | base62uuid }} = {{ view.markup | stringify }};
{% endfor %}

{% for event in events %}
Dom7(document).on({{ event.get('event') | stringify }}, '#e{{ event.get("element_id") }}', function(){
  {{ event.get('code') }}
});
{% endfor %}

{% if project.get('main_screen') %}
view.router.load({
  content: v_{{ project.get('main_screen') | base62uuid }},
  animatePages: false
});
{% endif %}