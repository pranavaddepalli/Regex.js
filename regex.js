var regexEngine = function(regex, string) {
    regexCounter = 0;
    stringCounter = 0;
  
    function match() {
      // if regex begins with ^, then the rest of the string should match
      if (regex[0] === '^') {
        // return true if regex matches with the rest of the string
        return matchFromHere(regexCounter+1, stringCounter);
      }
      // else begin backtracking. iterate through the string to find where regex starts matching
      for (var i = 0; i < string.length; i++) {
        if (matchFromHere(regexCounter, stringCounter + i)) {
          return true;
        }
      }
      // return false if no match at any point in the string
      return false;
    }
  
    function matchFromHere(regexCounter, stringCounter) {
      // there is a match if we are at the end of the string
      if (regexCounter === regex.length) {
        return true;
      }
      // handling the * case
      if (regex[regexCounter + 1] === '*') {
        return matchStar(regex[regexCounter], regexCounter + 2, stringCounter);
      }
      // handling the + case
      if (regex[regexCounter + 1] === '+') {
        return matchPlus(regex[regexCounter], regexCounter + 2, stringCounter);
      }
      // if regex specifies end of string ($) check if we are at the end of the string
      if (regex[regexCounter] === '$' && regexCounter === regex.length -1) {
        return stringCounter === string.length;
      }
      // continue recursion if not at end of the string
      if (stringCounter !== string.length && (regex[regexCounter] === '.' || regex[regexCounter] === string[stringCounter])) {
        return matchFromHere(regexCounter + 1, stringCounter + 1);
      }
      // if no conditions have been met, there is no match -- return false
      return false;
    };
  
    // lazy implementation to handle the * case
    function matchStar(starChar, regexCounter, stringCounter) {
      // * does not need to consume any characters if it can be matched from the start
      if (matchFromHere(regexCounter, stringCounter)) {
        return true;
      };
      // if consuming 0 characters fails, continue consuming one character at a time and check if the regex matches
      stringCounter++;
      while (stringCounter !== string.length && (string[stringCounter] === starChar || starChar === '.')) {
        if (matchFromHere(regexCounter, stringCounter)) {
          return true;
        }
        stringCounter++;
      }
      // if no matches found then return false
      return false;
    };
  
    // greedy implementation to handle the + case. 
    // consume every character and match. if it fails, then repeat with one less character until a match is found or one character remains
    function matchPlus(plusChar, regexCounter, stringCounter) {
      // count for characters matched. min is 1 for a successful match
      var numFound = 0;
      // if the first character doesn't match then return false
      if (string[stringCounter] !== plusChar && plusChar !== '.') {
        return false;
      }
      // increment stringCounter (consume a character) until the character no longer matches
      while (string[stringCounter] === plusChar || (plusChar === '.' && stringCounter !== string.length)) {
        stringCounter++;
        numFound++;
      }
      // check if the remaining combination matches
      if (matchHere(regexCounter, stringCounter) && numFound >= 1) {
        return true;
      }
      // remove a character and try again if failed
      else {
        stringCounter--;
        numFound--;
        while (string[stringCounter] === plusChar || (plusChar === '.' && stringCounter !== string.length && stringCounter !== 0)) {
          if (matchHere(regexCounter, stringCounter) && numFound >= 1) {
            return true;
          }
          stringCounter--; 
          numFound--;
        }
        return false;
      }
    }
    
    return match();
  };
  