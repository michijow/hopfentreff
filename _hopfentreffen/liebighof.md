---
title: Liebighof
image: 
  path: /images/PXL_20250306_174605190.jpg
  thumbnail: /images/PXL_20250306_174605190.jpg
  caption: "Photo from [Pexels](https://www.pexels.com)"
#share: "false"
#comments: "false"
bier_rating: 4
kaese_rating: 0
treffen_rating: 5
---

Wirtshaus im Lehel.

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

<div class="category" data-category="käsespätzle">
    <h3 class="category-title">Käsespätzle</h3>
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