var BlueRidge = BlueRidge || {};

BlueRidge.CommandLine = {
  passed: 0,

  failed: 0,

  messages: [],

  require: function(file, options){
    load(BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory(file));

    options = options || {};
    if(options['onload']) {
      options['onload'].call();
    }
  },

  debug: function(message){
    print(message);
  },
  
  prepareFilenameForRequireBasedOnSpecDirectory: function(filename){
    if(filename == null || filename[0] == "/") { return filename; }
    return (this.specDirname == null) ? filename : (this.specDirname + "/" + filename);
  },
  
  get fixtureFile(){
    return "fixtures/" + this.specFile.replace(/^(.*?)_spec\.js$/, "$1.html");
  },
  
  get specDirname(){
    if(this.specFile == null) { return null; }
    var pathComponents = this.specFile.split("/");
    var filename = pathComponents.pop();
    return (pathComponents.length > 0) ? pathComponents.join("/") : null;
  },
  
  get specBasename(){
    if(this.specFile == null) { return null; }
    return this.specFile.split("/").pop();
  },
  
  exampleName: function(element){
    var exampleName = $.trim($(element).children("h2").text());
    
    var names = this.contextNamesForExample(element);
    names.push(exampleName);
    
    return names.join(" ");
  },
  
  contextNamesForExample: function(element){
    var describes = $(element).parents('.describe').children('h1');
    
    var contextNames = $.map(describes, function(context){
      return $.trim($(context).text());
    });
    
    return contextNames.reverse();
  }
};

if(BlueRidge.loaded != true) {
  for (var i = 0; i < arguments.length; i++) {
    for (var name in this) {
      if ('BlueRidge' != name) {
        delete this[name];
      }
    }

    BlueRidge.CommandLine.specFile = arguments[i];

    var require = require || BlueRidge.CommandLine.require;
    var debug   = debug   || BlueRidge.CommandLine.debug;
    var console = console || { debug : debug, info : debug, log : debug };

    var BLUE_RIDGE_LIB_PREFIX = (environment["blue.ridge.prefix"] || "../../vendor/plugins/blue-ridge") + "/lib/";
    require(BLUE_RIDGE_LIB_PREFIX + "env.rhino.js");

    Envjs(BlueRidge.CommandLine.fixtureFile, {
      loadInlineScript: function(){},
      log: function(){}
    });

    require(BLUE_RIDGE_LIB_PREFIX + "jquery-1.3.2.js");
    require(BLUE_RIDGE_LIB_PREFIX + "jquery.fn.js");
    require(BLUE_RIDGE_LIB_PREFIX + "jquery.print.js");
    require(BLUE_RIDGE_LIB_PREFIX + "screw.builder.js");
    require(BLUE_RIDGE_LIB_PREFIX + "screw.matchers.js");
    require(BLUE_RIDGE_LIB_PREFIX + "screw.events.js");
    require(BLUE_RIDGE_LIB_PREFIX + "screw.behaviors.js");
    require(BLUE_RIDGE_LIB_PREFIX + "smoke.core.js");
    require(BLUE_RIDGE_LIB_PREFIX + "smoke.mock.js");
    require(BLUE_RIDGE_LIB_PREFIX + "smoke.stub.js");
    require(BLUE_RIDGE_LIB_PREFIX + "screw.mocking.js");
    require(BLUE_RIDGE_LIB_PREFIX + "consoleReportForRake.js");

    BlueRidge.loaded = true;
    load(BlueRidge.CommandLine.specFile);
    jQuery(window).trigger("load");
  }

  print("\n");

  jQuery.each(BlueRidge.CommandLine.messages, function(index, message) {
    print(message);
  });

  print((BlueRidge.CommandLine.passed + BlueRidge.CommandLine.failed) + ' tests, ' + BlueRidge.CommandLine.failed + ' failures');
}