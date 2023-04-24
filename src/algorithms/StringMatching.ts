export class StringMatching {
    BMAlgorithm(pattern: string, text: string) {
        var patternFix = pattern.toLowerCase();
        var textFix = text.toLowerCase();
        var patternLength = patternFix.length;
        var textLength = textFix.length;
        var badMatchTable = this.badMatch(patternFix);
        var badTableLength = badMatchTable.badTable.length;
        var i = patternLength - 1;
        var j = patternLength - 1;
        var flag = false;
        var found;
        var count = 0;
        var jump;
        var total = 0;

        while (i < textLength && !flag) {
            jump = 0;
            if (patternFix.charAt(j) == textFix.charAt(i)) {
                total++;
                if (total == pattern.length) {
                    flag = true;
                }
                j--;
                i--;
                count++;
            } else {
                total = 0;
                found = false;
                for (let k = 0; k < badTableLength; k++) {
                    if (badMatchTable.patternChar[k] == textFix.charAt(i)) {
                        if (badMatchTable.badTable[k] > jump) {
                            jump = badMatchTable.badTable[k];
                        }
                            found = true;
                            break;
                    }
                }
                if (!found) {
                    if (badMatchTable.badTable[badTableLength - 1] > jump) {
                        jump = badMatchTable.badTable[badTableLength - 1];
                    }
                }
                i += count;
                i += jump;
            }
        }
        return flag;
    }

    badMatch(pattern: string) {
        var patternLength = pattern.length;
        var flag;
        var k = 0;
        var patternChar = [];
        var badTable = [];

        for (let i = 0; i < patternLength; i++) {
        flag = false;
        for (let j = 0; j < i; j++) {
            if (pattern.charAt(i) == patternChar[j]) {
            badTable[j] = Math.max(1, patternLength - i - 1);
            flag = true;
            break;
            }
        }
        if (!flag) {
            patternChar[k] = pattern.charAt(i);
            badTable[k] = Math.max(1, patternLength - i - 1);
            k++;
        }
        }
        patternChar[k] = "*";
        badTable[k] = patternLength;

        return { badTable, patternChar };
    }

    KMPAlgorithm(pattern: string, text: string) {
        var patternFix = pattern.toLowerCase();
        var textFix = text.toLowerCase();
        var patternLength = patternFix.length;
        var textLength = textFix.length;
        var patternLPS = this.lpsArray(patternFix);
        var flag = false;

        var i = 0;
        var j = -1;

        while (i < textLength && !flag && patternLength == textLength) {
        if (patternFix.charAt(j + 1) == textFix.charAt(i)) {
            if (i + 1 == textLength) {
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
        return flag;
    }

    lpsArray(pattern: string) {
        var patternLength = pattern.length;
        var flag = false;
        var backTo = 0;
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