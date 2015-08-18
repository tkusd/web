## Structure

HTML:

``` html
<body>
    <!-- Status bar overlay for full screen mode (PhoneGap) -->
    <div class="statusbar-overlay"></div>
    <!-- Panels overlay -->
    <div class="panel-overlay"></div>
    <!-- Views -->
    <div class="view view-main">
        <div class="pages">
            <!-- All screen comes here -->
            <div class="page" data-page="{screen id}">
        </div>
    </div>
</body>
```

JavaScript:

``` js
var app = new Framework7({
    material: false,
    modalTitle: 'test',
    modalCloseByOutside: true
});

var view = app.addView('.view-main', {
    domCache: true
});

view.router.load({
    pageName: '{main screen id}',
    animatePages: false
});
```

## Elements

### navbar

第一個 Navbar：

``` html
<div class="navbar">
    <div class="navbar-inner">
        <div class="left">
            <!-- Elements with position = "left" -->
        </div>
        <div class="center">
            {attributes.title}
        </div>
        <div class="right">
            <!-- Elements with position = "right" -->
        </div>
    </div>
</div>
```

其他 Navbar：

``` html
<div class="subnavbar">
    <!-- children -->
</div>
```

### toolbar

``` html
<div class="toolbar">
    <div class="toolbar-inner">
        <!-- children -->
    </div>
</div>
```

### label

``` html
<div>{attributes.text}</div>
```

Attributes:

- text

### card

``` html
<div class="card">
    <div class="card-header">
        <!-- header -->
    </div>
    <div class="card-content">
        <div class="card-content-inner">
            <!-- children -->
        </div>
    </div>
    <div class="card-footer">
        <!-- footer -->
    </div>
</div>
```

### button

在特定元素中，class name 會被強制轉換為 `link`。

``` html
<a class="button" href={attributes.href || '#'}>{attributes.text}</a>
```

Attributes:

- text
- href
- active
- round
- fill
- big
- raised

### block

``` html
<div class="content-block-title">{attributes.title}</div>
<div class="content-block">
    <!-- children -->
</div>
```

### buttonRow

``` html
<div class="buttons-row">
    <!-- children -->
</div>
```

## Actions

### alert

``` js
app.alert(event.text, event.title);
```

Attributes:

- text
- title

### confirm

``` js
app.confirm(event.text, event.title);
```

Attributes:

- text
- title

### prompt

``` js
app.prompt(event.text, event.title);
```

Attributes:

- text
- title

### transition

``` js
view.router.load({
    pageName: '{screen id}'
});
```

Attributes:

- screen

### back

``` js
view.router.back();
```