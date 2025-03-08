---
title: Schinken-Peter
image: 
  path: /images/beer.jpg
  thumbnail: /images/beer_tn.jpg
  caption: "Photo from [Pexels](https://www.pexels.com)"
#share: "false"
comments: "true"
bier_rating: 3
kaese_rating: 3
treffen_rating: 5
---

Wirtshaus in Giesing.

# Bewertung

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../rating.css">
</head>

<div class="category" data-category="bier">
    <h3 class="category-title">Hopfen</h3>
    <div class="rating">
        {% for i in (1..5) %}
            <span class="beer {% if i <= page.bier_rating %}selected{% endif %}">&#x1F37A;</span>
        {% endfor %}
    </div>
</div>

<div class="category" data-category="käsepätzle">
    <h3 class="category-title">Käsepätzle</h3>
    <div class="rating">
        {% for i in (1..5) %}
            <span class="cheese {% if i <= page.kaese_rating %}selected{% endif %}">&#x1F9C0;</span>
        {% endfor %}
    </div>
</div>

<div class="category" data-category="treff">
    <h3 class="category-title">Treff</h3>
    <div class="rating">
        {% for i in (1..5) %}
            <span class="friend {% if i <= page.treffen_rating %}selected{% endif %}">&#128588;</span>
        {% endfor %}
    </div>
</div>