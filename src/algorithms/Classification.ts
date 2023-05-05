export class Classification {
    // Classify is empty or not
    isEmpty = (s: string) => {
        const regexEmpty = /^\s*$/;
        let flag;
        if (regexEmpty.test(s)){
            flag = true;
        } else {
            flag = false;
        }
        return flag;
    }

    // Classify is calculator or not
    isCalculator = (s: string) => {
        const regexCalculator= /^(?:(?:Berapa|Hitung|Kalkulasi)\s+)?([()\d+\-*/.^\s]+)(\?)?$/;
        const operatorsArray = ["+", "-", "*", "/", "^"];
        const match = regexCalculator.exec(s);
        let result = 0;
        let flag = false;

        if (match) {
            let values = [];
            let operators = [];
            let input = match[1].split('');

            for (let i = 0; i < input.length; i++){
                if (input[i] == ' '){
                    // Checking if before and after number or not
                    let j = i, k = i;
                    let wrong = false;
                    let done = false;
                    while(--j >= 0 && !done){
                        if(input[j] >= '0' && input[j] <= '9'){
                            while(++k < input.length && !wrong){
                                if(input[k] >= '0' && input[k] <= '9'){
                                    done = true;
                                    wrong = true;
                                    break;
                                } else if(input[k] != ' '){
                                    done = true;
                                    break;
                                }
                            }
                        } else if(input[j] != ' '){
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
                
                if(input[i] >= '0' && input[i] <= '9'){
                    let tempValue = input[i];
                    
                    while (i+1 < input.length && ((input[i+1] >= '0' && input[i+1] <= '9') || input[i+1] == '.')){
                        tempValue += input[++i];
                    }
                    
                    values.push(Number(tempValue));
                }

                if (input[i] == '('){
                    if (input[i+1] == '-'){
                        values.push(0);
                    }
                    operators.push(input[i]);
                }

                if (input[i] == ')'){
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

                if (operatorsArray.includes(input[i])){
                    if(input[i] == "-" && i == 0){
                        values.push(0);
                    }
                    let tempOps = input[i];
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

            result = values.pop() as number;
            flag = true;
            return {flag, result};
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
        const inputCleaned = s.replace(/(?: \?|\?)*/g, "").replace(/\s+$/, "");
        const inputArr = inputCleaned.split(" ");
        const dateString = inputArr[inputArr.length - 1];
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        let match = dateString.match(dateRegex);
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
            if (month == 2) {
                if (year % 4 == 0 && year % 100 != 0){
                    maxDay = 29;
                } else {
                    maxDay = 28;
                }
            }
            else if (month == 4 || month == 6 || month == 9 || month == 11){
                maxDay = 30;
            }
            else {
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
        }

        return { flag, result };
    }

    // Classify is delete or not
    isDelete = (s: string) => {
        const regexDelete: RegExp = /^Hapus pertanyaan .+$/;
        if (regexDelete.test(s)) {
            return true;
        } else {
            return false;
        }
    };

    // Classify is add or not
    isAdd = (s: string) => {
        const regexAdd: RegExp = /^Tambahkan pertanyaan .+ dengan jawaban .+$/;
        if (regexAdd.test(s)) {
            return true;
        } else {
            return false;
        }
    };
}