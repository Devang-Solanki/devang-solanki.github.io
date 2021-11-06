
{% for entry in site.data.tryhackme %}
{% capture fullurl %}{{ site.baseurl }}{{ entry.url }}{% endcapture %}
    {% if fullurl == page.url %}
        {% assign current_page = fullurl %}
        {% break %}
    {% elsif page.url contains fullurl %}
        {% assign current_page = fullurl %}
    {% endif %}
{% endfor %}

<div style="box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
{% for entry in site.data.tryhackme %}
        {% if entry.url == current_page %}
            {% assign current = ' class="current"' %}
        {% else %}
            <!-- We have to declare it 'null' to ensure it doesn't propagate. -->
            {% assign current = null %}
        {% endif %}
        {% assign sublinks = entry.sublinks %}
  {% for sublink in sublinks %}
   ### <a href="{{ site.baseurl }}{{ sublink.url }}">{{ sublink.title }}</a>
    {{ sublink.meta }} 
                
                {% endfor %}
  {% endfor %}
  
</div>
