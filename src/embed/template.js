'use strict';

var app = new Framework7({
  material: {% if project.get('theme') == 'material' %}true{% else %}false{% endif %},
  modalTitle: {{ project.get('title') | stringify }},
  modalCloseByOutside: true
});

var view = app.addView('.view-main');
var viewContents = {};
var listSelections = {};

{% for view in views %}
viewContents[{{ view.key | stringify }}] = {{ view.markup | stringify }};
{% endfor %}

{% for event in events %}
  {% set element = elements.get(event.get('element_id')) %}

  {% if event.get('event') == 'init' %}
    app.onPageInit('{{ event.get("element_id") }}', function(){
      {{ event.get('code') }}
    });
  {% elif event.get('event') == 'itemClick' %}
    Dom7(document).on('click', '#e{{ event.get("element_id") }} li', function(){
      var index = this.dataset.index;
      if (!index) return;

      var list = this.parentNode.parentNode;
      var listID = list.id;
      if (!listID) return;

      listSelections[listID.substring(1)] = +index + 1;

      {{ event.get('code') }}
    });
  {% else %}
    Dom7(document).on({{ event.get('event') | stringify }}, '#e{{ event.get("element_id") }}', function(){
      {{ event.get('code') }}
    });
  {% endif %}
{% endfor %}

{% if project.get('main_screen') %}
view.router.load({
  content: viewContents[{{ project.get('main_screen') | stringify }}],
  animatePages: false
});
{% endif %}