export class StringMatching {
    BMAlgorithm(pattern : string, text : string): boolean {
        let patternFix = pattern.toLowerCase();
        let textFix = text.toLowerCase();
        let patternLength = patternFix.length;
        let textLength = textFix.length;
        let badMatchTable = new Array(patternLength);
        let shift = 0;
        let idxPattern;
        let flag = false;

        this.badMatch(patternFix, patternLength, badMatchTable);

        if (patternLength == textLength){
            while ( (textLength - patternLength ) >= shift){
                idxPattern = patternLength - 1;

                while ( idxPattern >= 0 && patternFix.charAt(idxPattern) == textFix.charAt(shift+idxPattern)){
                    idxPattern--;
                }

                if ( idxPattern < 0){
                    flag = true;
                    if (shift + patternLength < textLength){
                        shift += textLength - badMatchTable[text.charAt(shift + patternLength).charCodeAt(0)];
                    }
                    else {
                        shift += 1;
                    }
                }
                else {
                    flag = false;
                    shift += Math.max(1, idxPattern - badMatchTable[text.charAt(shift+idxPattern).charCodeAt(0)]);
                }
            }
        } else { 
            flag = false;
        }

        return flag;
    }

    badMatch(pattern : string, patternLength : number, badMatchTable : Array<number>){

        for(let i = 0; i < 256; i++){
            badMatchTable[i] = -1;
        }

        for(let j = 0; j< patternLength; j++){
            badMatchTable[pattern.charAt(j).charCodeAt(0)] = j;
        }

    }

    KMPAlgorithm(pattern: string, text: string): boolean{
        let patternFix = pattern.toLowerCase();
        let textFix = text.toLowerCase();
        let patternLength = patternFix.length;
        let textLength = textFix.length;
        let patternLPS = this.lpsArray(patternFix);
        let flag = false;

        let i = 0;
        let j = -1;

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