var regexEngine = function(regex, string) {
    regexCounter = 0;
    stringCounter = 0;
  
    function match() {
      // if regex starts with ^ then string must begin with match of remainder of expression
      if (regex[0] === '^') {
        // if regex matches starting with first character, return true
        return matchHere(regexCounter+1, stringCounter);
      }
      // else (backtracking): iterate through string, check if string matches beginning of expression at each point in string
      for (var i = 0; i < string.length; i++) {
        if (matchHere(regexCounter, stringCounter + i)) {
          return true;
        }
      }
      // if regex can't be matched at any starting point, return false
      return false;
    }
};

