(function (root) {

  root.pw = root.pw || {};

  root.pw.ChartDataModel = {
    build: build
  };

  function build (data) {
    return {
      title: data.title,
      textList: getTextList(data.benefits)
    };
  }

  function getTextList (benefits) {
    var
      list = prepareTextList(benefits),
      bigText = list.reduce(function (prev, current) {
        return (prev.data.length > current.data.length) ? prev : current
      }),
      maxSizeIndex = list.indexOf(bigText);

    list[maxSizeIndex].useWidth = true;

    return list;
  }

  function prepareTextList (benefits) {
    var list = [];
    // Start preparation with no indent for main list
    start(benefits, 35, 0);
    return list;

    /**
     * Starts the wrapping and text model preparation
     *
     * @param items {object} List of benefits / highligths
     * @param wrap {number} Wrap length
     * @param indent {number} Indent length
     */
    function start (items, wrap, indent) {
      items
        .forEach(function (item) {
          list = list.concat(wrapTextAndBuildModel(item.name, wrap, indent));
          // Build sublist as well, only if available
          if (item.highlights) {
            // Introduce a indent of 10
            start(item.highlights, 30, 10);
          }
        });
    }
  }

  function wrapTextAndBuildModel (benefit, length, indent) {
    var
      lines = [],
      indented = !!indent;
    // Reduce length if indent value is available
    length = indented ? length - indent : length;
    // Trim the sentence and start wrapping
    start(benefit.trim(), length, false);

    return lines;

    /**
     * Wrap the sentence into a list of sentences
     *
     * @param sentence {string} is the sentence to be startped
     * @param breakPoint {number} wrapping point
     * @returns {boolean}
     */
    function start (sentence, breakPoint, isRecursive) {
      var
        line,
        spaceIndex,
        balance,
        balanceBreakIndex,
        breakIndex = breakPoint - 1;
      // If the sentence exceeds 50 break it down
      if (sentence.length > breakPoint) {
        // If character at 50th index is not white space, then damn sure we are attempting to break a word.
        // To fix this, move the word to next line
        if (!(/\s/.test(sentence.charAt(breakPoint)))) {
          // Find the last white space before 50th index
          spaceIndex = sentence.lastIndexOf(' ', breakIndex);
          balanceBreakIndex = spaceIndex === -1 ? spaceIndex = breakPoint : spaceIndex + 1;
          // Suppose the string is one full word, force break it
          // Break the sentence at the space index
          line = sentence.substr(0, spaceIndex);
          // Detect the sentence balance
          balance = sentence.slice(balanceBreakIndex);
        }
        // If character at 50th index is a space, then just break the sentence at break index
        else {
          // Broken line
          line = sentence.substr(0, breakIndex);
          // Slice the balance
          balance = sentence.slice(breakPoint);
        }
      }
      // If the sentence is less than break point, job is easy. Just use the sentence
      else {
        line = sentence;
        balance = 0; // No more balance;
      }
      lines.push({data: line, indented: indented, pointer: !isRecursive});
      // Suppose if the balance length exceeds break point, continue to wrap
      if (balance.length > breakPoint) {
        start(balance.trim(), breakPoint, true);
      } else if (balance) {
        lines.push({data: balance, indented: indented});
      }
    }
  }

})(window);