<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{ project.get('title') }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
  {% if project.get('theme') === 'material' %}
    <link rel="stylesheet" href="framework7/css/framework7.material.min.css">
    <link rel="stylesheet" href="framework7/css/framework7.material.colors.min.css">
  {% else %}
    <link rel="stylesheet" href="framework7/css/framework7.ios.min.css">
    <link rel="stylesheet" href="framework7/css/framework7.ios.colors.min.css">
  {% endif %}
</head>
<body>
  <div class="statusbar-overlay"></div>
  <div class="panel-overlay"></div>
  {{ views }}
  <script src="cordova.js"></script>
  <script src="framework7/js/framework7.min.js"></script>
  <script src="js/script.js"></script>
</body>
</html>