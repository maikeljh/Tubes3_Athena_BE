export class Classification {
    // Classify is empty or not
    isEmpty = (s: string) => {
        // Regex empty message
        const regexEmpty = /^\s*$/;
        let flag;
        
        // Test string with regex pattern
        if (regexEmpty.test(s)){
            flag = true;
        } else {
            flag = false;
        }
        return flag;
    }

    // Classify is calculator or not
    isCalculator = (s: string) => {
        // Regex calculator
        const regexCalculator= /^(?:(?:Berapa|Hitung|Kalkulasi)\s+)?([()\d+\-*/.^\s]+)(\?)?$/i;

        // Array of operators
        const operatorsArray = ["+", "-", "*", "/", "^"];

        // Try to find match regex pattern in string
        const match = regexCalculator.exec(s);

        // Initialize variables
        let result = 0;
        let flag = false;

        // If match found
        if (match) {
            // Initialize variables
            let values = [];
            let operators = [];
            let input = match[1].split('');
            let newInput = [];
            for(let i = 0; i < input.length; i++){
                if(input[i] == '('){
                    if(i > 0){
                        let needInsertMultiply = false;
                        let tempIdx = i-1;
                        while(tempIdx >= 0){
                            if(input[tempIdx] == ')' || (input[tempIdx] >= '0' && input[tempIdx] <= '9')){
                                needInsertMultiply = true;
                                break;
                            } else if(input[tempIdx] != ' '){
                                break;
                            }
                            tempIdx--;
                        }
                        if(needInsertMultiply){
                            newInput.push('*');
                            newInput.push(input[i]);
                        } else {
                            newInput.push(input[i]);
                        }
                    } else {
                        newInput.push(input[i]);
                    }
                } else {
                    newInput.push(input[i]);
                }
            }
            for (let i = 0; i < newInput.length; i++){
                if (newInput[i] == ' '){
                    // Checking if before and after number or not
                    let j = i, k = i;
                    let wrong = false;
                    let done = false;
                    while(--j >= 0 && !done){
                        if(newInput[j] >= '0' && newInput[j] <= '9'){
                            while(++k < newInput.length && !wrong){
                                if(newInput[k] >= '0' && newInput[k] <= '9'){
                                    done = true;
                                    wrong = true;
                                    break;
                                } else if(newInput[k] != ' '){
                                    done = true;
                                    break;
                                }
                            }
                        } else if(newInput[j] != ' '){
                            done = true;
                            break;        
                        }
                    }
                    if(!wrong){
                        continue;
                    } else {
                        flag = true;
                        return {flag, undefined};
                    }
                }
                
                if(newInput[i] >= '0' && newInput[i] <= '9'){
                    let tempValue = newInput[i];
                    
                    while (i+1 < newInput.length && ((newInput[i+1] >= '0' && newInput[i+1] <= '9') || newInput[i+1] == '.')){
                        tempValue += newInput[++i];
                    }
                    
                    values.push(Number(tempValue));
                }

                if (newInput[i] == '('){
                    if (newInput[i+1] == '-'){
                        values.push(0);
                    }
                    operators.push(newInput[i]);
                }

                if (newInput[i] == ')'){
                    while (operators[operators.length - 1] != '('){
                        const tempCalOps = operators.pop();
                        const tempCalVal1 = values.pop() as number;
                        const tempCalVal2 = values.pop() as number;
                        if (tempCalOps != undefined && tempCalVal1 != undefined && tempCalVal2 != undefined){
                            values.push(calculate(tempCalOps, tempCalVal1, tempCalVal2));
                        }
                    }
                    operators.pop();
                }

                if (operatorsArray.includes(newInput[i])){
                    if(newInput[i] == "-" && i == 0){
                        values.push(0);
                    }
                    let tempOps = newInput[i];
                    while (operators.length > 0 && priorityOps(tempOps, operators[operators.length -1])){
                        const tempCalOps = operators.pop();
                        const tempCalVal1 = values.pop() as number;
                        const tempCalVal2 = values.pop() as number;
                        if (tempCalOps != undefined && tempCalVal1 != undefined && tempCalVal2 != undefined){
                            values.push(calculate(tempCalOps, tempCalVal1, tempCalVal2));
                        }
                    }
                    operators.push(tempOps);
                }
            }

            while (operators.length > 0) {
                const tempCalOps = operators.pop();
                const tempCalVal1 = values.pop() as number;
                const tempCalVal2 = values.pop() as number;
                if (tempCalOps != undefined && tempCalVal1 != undefined && tempCalVal2 != undefined){
                    values.push(calculate(tempCalOps, tempCalVal1, tempCalVal2));
                }
            }

            if(values.length > 1){
                flag = true;
                return {flag, undefined};
            } else {
                result = values.pop() as number;
                flag = true;
                return {flag, result};
            }
        } else {
            return {flag, result} ;
        }

        function priorityOps (ops1: String, ops2: String) {
            if (ops2 == '(' || ops2 == ')' || ops1 == "^"){
                return false;
            }
            else if ((ops1 == '*' || ops1 == '/') && (ops2 == "+" || ops2 == "-")){
                return false;
            }
            else {
                return true;
            }
        }

        function calculate(ops: String, b: number, a: number){
            switch (ops){
                case '+' :
                    return a + b;
                case '-' :
                    return a - b;
                case '*' :
                    return a * b;
                case '/' :
                    return a / b;
                case "^" :
                    return a ** b;
            }
            return 0;
        }
    };

    // Classify is date or not
    isDate = (s: string) => {
        // Find date from string
        const inputCleaned = s.replace(/(?: \?|\?)*/g, "").replace(/\s+$/, "");
        const inputArr = inputCleaned.split(" ");
        const dateString = inputArr[inputArr.length - 1];
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        let match = dateString.match(dateRegex);

        // Initialize variables
        let flag = true;
        let result = 0;

        if (!match){
            flag = false;
        } else {
            let year = parseInt(match[3]);
            let month = parseInt(match[2]);
            let day = parseInt(match[1]);
            let maxDay = 0;

            // set max day
            if (year >= 1753){
                if (month == 2) {
                    if (year % 4 == 0 && year % 100 != 0){
                        maxDay = 29;
                    } else {
                        maxDay = 28;
                    }
                } else if (month == 4 || month == 6 || month == 9 || month == 11){
                    maxDay = 30;
                } else {
                    maxDay = 31;
                }

                if (day > maxDay || day < 1 || month < 1 || month > 12){
                    flag = false;
                } else {
                    // adjust month and year to Zeller's Rule
                    if (month < 3) {
                        month +=12;
                        year--;
                    }
                    if(month >=3) {
                        month -=2;
                    }

                    const k = day;
                    const m = month;
                    const D = year % 100;
                    const C = Math.floor( year / 100);

                    // Zeller's Rule
                    result = k + Math.floor((13 * m -1) / 5) + D + Math.floor(D / 4) + Math.floor(C / 4) - 2 * C;
                    result = Math.abs(result % 7);
                }
            } else {
                flag = false;
            }
        }

        return { flag, result };
    }

    // Classify is delete or not
    isDelete = (s: string) => {
        // Regex delete qna
        const regexDelete: RegExp = /^Hapus pertanyaan .+$/i;
        if (regexDelete.test(s)) {
            return true;
        } else {
            return false;
        }
    };

    // Classify is add or not
    isAdd = (s: string) => {
        // Regex add qna
        const regexAdd: RegExp = /^Tambahkan pertanyaan .+ dengan jawaban .+$/i;
        if (regexAdd.test(s)) {
            return true;
        } else {
            return false;
        }
    };
}