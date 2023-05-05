export class StringMatching {
  BMAlgorithm(pattern: string, text: string): boolean {
    // Convert the pattern and text to lowercase
    let patternFix = pattern.toLowerCase();
    let textFix = text.toLowerCase();

    // Get the lengths of the pattern and text
    let patternLength = patternFix.length;
    let textLength = textFix.length;

    // Create an array to store the bad match table
    let badMatchTable = new Array(patternLength);

    // Initialize variables
    let shift = 0;
    let idxPattern;
    let flag = false;

    // Create the bad match table
    this.badMatch(patternFix, patternLength, badMatchTable);

    // Check if the pattern is shorter than the text
    if (patternLength <= textLength) {
      // Loop through the text
      while (textLength - patternLength >= shift) {
        idxPattern = patternLength - 1;

        while (
          idxPattern >= 0 &&
          patternFix.charAt(idxPattern) == textFix.charAt(shift + idxPattern)
        ) {
          idxPattern--;
        }

        if (idxPattern < 0) {
          flag = true;
          if (shift + patternLength < textLength) {
            shift +=
              textLength -
              badMatchTable[text.charAt(shift + patternLength).charCodeAt(0)];
          } else {
            shift += 1;
          }
        } else {
          flag = false;
          shift += Math.max(
            1,
            idxPattern -
              badMatchTable[text.charAt(shift + idxPattern).charCodeAt(0)]
          );
        }
      }
    } else {
      flag = false;
    }
    return flag;
  }

  badMatch(
    pattern: string,
    patternLength: number,
    badMatchTable: Array<number>
  ) {
    // Initialize the bad match table
    for (let i = 0; i < 256; i++) {
      badMatchTable[i] = -1;
    }

    // Fill in the bad match table with the appropriate values
    for (let j = 0; j < patternLength; j++) {
      badMatchTable[pattern.charAt(j).charCodeAt(0)] = j;
    }
  }

  KMPAlgorithm(pattern: string, text: string): boolean {
    // Convert the pattern and text to lowercase
    let patternFix = pattern.toLowerCase();
    let textFix = text.toLowerCase();

    // Get the lengths of the pattern and text
    let patternLength = patternFix.length;
    let textLength = textFix.length;

    // Create an array to store the bad match table
    let patternLPS = this.lpsArray(patternFix);
    let flag = false;

    // Initialize variables
    let i = 0;
    let j = -1;

    // Check if the pattern is shorter than the text
    if (patternLength <= textLength) {
      // Loop through the text
      while (i < textLength && !flag) {
        if (patternFix.charAt(j + 1) == textFix.charAt(i)) {
          if (j + 1 == patternLength - 1) {
            flag = true;
          }
          j++;
          i++;
        } else {
          if (j == -1) {
            i++;
          } else {
            j = patternLPS[j + 1] - 1;
          }
        }
      }
    }
    return flag;
  }

  lpsArray(pattern: string) {
    let patternLength = pattern.length;
    let flag = false;
    let backTo = 0;
    const patternChar = [];
    const lpsArray = [];

    for (let i = 0; i < patternLength; i++) {
      patternChar[i] = pattern.charAt(i);
    }

    for (let j = 0; j <= patternLength; j++) {
      if (j == 0) {
        lpsArray[j] = -1;
        flag = false;
        backTo = 0;
      } else if (j == 1) {
        lpsArray[j] = 0;
        flag = false;
        backTo = 0;
      } else {
        for (let k = 0; k < j - 1; k++) {
          if (patternChar[j - 1] == patternChar[k]) {
            flag = true;
            backTo++;
            lpsArray[j] = backTo;
            break;
          } else {
            flag = false;
            lpsArray[j] = 0;
          }
        }
        if (!flag) {
          backTo = 0;
        }
      }
    }
    return lpsArray;
  }
}
