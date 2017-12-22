
var Parameter = {
  vars:  {},
  allowedVariables: [],
  onLoad: function(callback) {

      window.onload = callback();
    
  },
  parseURL: function(delimeter) {
      let varArray = window.location.href.split(delimeter).slice(1, this.length);
      Parameter.vars.array = varArray;
      return varArray;
  },
  updateVariables: function() {
      let vars = Object.keys(Parameter.vars.array);
      vars.forEach(function(item){
        var itemSplit = Parameter.vars.array[item].split("=");
        Parameter.allowedVariables.indexOf(itemSplit[0]) !== -1 ? Parameter.vars[itemSplit[0]] = itemSplit[1] : console.log("variable _" +  itemSplit[0] + "_ not allowed")/* IMPORTANT */; 
    });
  },
  updateVariablesOnload: function(allowed, delimeter) {
    Parameter.onLoad(function(){
      Parameter.allowedVariables = allowed;
      Parameter.parseURL(delimeter);
      Parameter.updateVariables();
      return Parameter.vars
    });
  }
}

Parameter.updateVariablesOnload(["hello"], "?");
