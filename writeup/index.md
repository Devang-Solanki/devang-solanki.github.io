{% for entry in site.data.writeup %}
{% capture fullurl %}{{ site.baseurl }}{{ entry.url }}{% endcapture %}
    {% if fullurl == page.url %}
        {% assign current_page = fullurl %}
        {% break %}
    {% elsif page.url contains fullurl %}
        {% assign current_page = fullurl %}
    {% endif %}
{% endfor %}

{% for entry in site.data.writeup %}
        {% if entry.url == current_page %}
            {% assign current = ' class="current"' %}
        {% else %}
            <!-- We have to declare it 'null' to ensure it doesn't propagate. -->
            {% assign current = null %}
        {% endif %}
        {% assign sublinks = entry.sublinks %}
  {% for sublink in sublinks %}
   <h1> <a href="{{ site.baseurl }}{{ sublink.url }}">{{ sublink.title }}</a> </h1> 
   <p> {{ sublink.meta }} </p>
                
   {% endfor %}
  {% endfor %}



  

