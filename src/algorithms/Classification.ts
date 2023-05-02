export class Classification {

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

    isCalculator = (s: string) => {
        const regexCalculator= /^[()\d+\-*/.\s]+(\?)?$/;
        const operators = ["+", "-", "*", "/"];
        let result = 0;
        let flag = false;
        if (regexCalculator.test(s)) {
        
            let values = [];
            let operands = [];
            
            let input = s.split('');
            
            for (let i = 0; i < input.length; i++){
                if (input[i] == ' '){
                    continue;
                }
                
                if(input[i] >= '0' && input[i] < '9'){
                    let tempValue ="";
                    
                    while (i < input.length && ((input[i] >= '0' && input[i] <= '9') || input[i] == '.')){
                        tempValue += input[i++];
                    }
                    
                    values.push(Number(tempValue));
                }
                if (input[i] == '('){
                    if (input[i+1] == '-'){
                        values.push(0);
                    }
                    operands.push(input[i]);
                }
                if (input[i] == ')'){
                    while (operands[operands.length - 1] != '('){
                        const tempCalOps = operands.pop();
                        const tempCalVal1 = values.pop() as number;
                        const tempCalVal2 = values.pop() as number;
                        if (tempCalOps != undefined && tempCalVal1 != undefined && tempCalVal2 != undefined){
                            values.push(calculate(tempCalOps, tempCalVal1, tempCalVal2));
                        }
                    }
                    operands.pop();
                }
                if (operators.includes(input[i])){
                    let tempOps = input[i];
                    if (tempOps == '*' && i < input.length){
                        if (input[i+1] == '*') {
                            tempOps = "**";
                            i++;
                        }
                    }
                    while (operands.length > 0 && priorityOps(tempOps, operands[operands.length -1])){
                        const tempCalOps = operands.pop();
                        const tempCalVal1 = values.pop() as number;
                        const tempCalVal2 = values.pop() as number;
                        if (tempCalOps != undefined && tempCalVal1 != undefined && tempCalVal2 != undefined){
                            values.push(calculate(tempCalOps, tempCalVal1, tempCalVal2));
                        }
                    }
                    operands.push(tempOps);
                }
            }
            while (operands.length > 0) {
                const tempCalOps = operands.pop();
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
            if (ops2 == '(' || ops2 == ')' || ops1 == "**"){
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
                    if (b == 0){
                        console.log("Cannot divide by 0");
                    }
                    return a / b;
                case "**" :
                    return a ** b;
            }
            return 0;
        }
    };

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
                    month +=10;
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
                result %=7;
            }
        }

        return { flag, result };
    }

    isDelete = (s: string) => {
        const regexDelete: RegExp = /^(Hapus pertanyaan)/;
        if (regexDelete.test(s)) {
            return true;
        } else {
            return false;
        }
    };

    isAdd = (s: string) => {
        const regexAdd: RegExp = /^Tambahkan pertanyaan .+ dengan jawaban .+$/;
        if (regexAdd.test(s)) {
            return true;
        } else {
            return false;
        }
    };
}