crossroads.addRoute('/', function() {
    $('#content').html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
    import('../App/Controller/Home.js')
    .then(Home => {
        $(".else-content").load('App/View/Home.html');
        Home.default.onLoad();
    });
    
});

crossroads.addRoute('/AddCase', function() {
    $('#content').html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
    import('../App/Controller/AddCase.js')
    .then(AddCase => {
        $(".else-content").load('App/View/AddCase.html');
        AddCase.default.onLoad();
    });
});

crossroads.addRoute('/DataEntry', function() {
    $('#content').html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
    import('../App/Controller/DataEntry.js')
    .then(DataEntry => {
        $(".else-content").load('App/View/DataEntry.html');
        DataEntry.default.onLoad();
    });
});

crossroads.addRoute('/HourlyData', function() {
    $('#content').html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
    import('../App/Controller/HourlyData.js')
    .then(HourlyData => {
        $(".else-content").load('App/View/HourlyData.html');
        HourlyData.default.onLoad();
    });
});

crossroads.addRoute('/TechData', function() {
    $('#content').html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
    import('../App/Controller/TechData.js')
    .then(TechData => {
        $(".else-content").load('App/View/TechData.html');
        TechData.default.onLoad();
    });
});

crossroads.addRoute('/ConfigData', function() {
    $('#content').html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
    import('../App/Controller/ConfigData.js')
    .then(ConfigData => {
        $(".else-content").load('App/View/ConfigData.html');
        ConfigData.default.onLoad();
    });
});

crossroads.bypassed.add(function(request) {
    console.error(request + ' seems to be a dead end...');
});

//setup hasher
hasher.init(); //start listening for history change

//Listen to hash changes
window.addEventListener("hashchange", function() {
    var route = '/';
    var hash = window.location.hash;
    if (hash.length > 0) {
        route = hash.split('#').pop();
    }
//console.log(hash);
//console.log(route);
    crossroads.parse(route);
});

// trigger hashchange on first page load
window.dispatchEvent(new CustomEvent("hashchange"));
