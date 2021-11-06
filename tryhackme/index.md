<style>
/* 
* Design by Robert Mayer:https://goo.gl/CJ7yC8
*
*I intentionally left out the line that was supposed to be below the subheader simply because I don't like how it looks.
*
* Chronicle Display Roman font was substituted for similar fonts from Google Fonts.
*/

body {
  background-color: #fdf1ec;
}

.wrapper {
  height: 210px;
  width: 1000px;
  margin: 50px auto;
  border-radius: 7px 7px 7px 7px;
  /* VIA CSS MATIC https://goo.gl/cIbnS */
  -webkit-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
}

.product-img {
  float: left;
  height: 210px;
  width: 250px;
}

.product-img img {
  border-radius: 7px 0 0 7px;
}

.product-info {
  float: left;
  height: 210px;
  width: 750px;
  border-radius: 0 7px 10px 7px;
  background-color: #ffffff;
}

.product-text {
  height: 300px;
  width: 327px;
}

.product-text h1 {
  margin: 0 0 0 38px;
  padding-top: 52px;
  font-size: 34px;
  color: #474747;
}

.product-text h1,
.product-price-btn p {
  font-family: 'Bentham', serif;
}

.product-text h2 {
  margin: 0 0 47px 38px;
  font-size: 13px;
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  color: #d2d2d2;
  letter-spacing: 0.2em;
}

.product-text p {
  height: 125px;
  margin: 0 0 0 38px;
  font-family: 'Playfair Display', serif;
  color: #8d8d8d;
  line-height: 1.7em;
  font-size: 15px;
  font-weight: lighter;
  overflow: hidden;
}


span {
  display: inline-block;
  height: 50px;
  font-family: 'Suranna', serif;
  font-size: 34px;
}

</style>



{% for entry in site.data.tryhackme %}
{% capture fullurl %}{{ site.baseurl }}{{ entry.url }}{% endcapture %}
    {% if fullurl == page.url %}
        {% assign current_page = fullurl %}
        {% break %}
    {% elsif page.url contains fullurl %}
        {% assign current_page = fullurl %}
    {% endif %}
{% endfor %}

<div class="wrapper">
    <div class="product-img">
      <img src="https://tryhackme-images.s3.amazonaws.com/room-icons/fcf1ff6eabd1d1e09500184b049a2e66.png" height="210" width="250">
    </div>
    <div class="product-info">
      <div class="product-text">
        {% for entry in site.data.tryhackme %}
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
      </div>
    </div>
  </div>



  

