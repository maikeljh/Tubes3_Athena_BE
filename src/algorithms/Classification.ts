export class Classification {
    isCalculator = (s: string) => {
        const regexCalculator: RegExp = /^[()\d+\-*/.\s]+(\?)?$/;
        if (regexCalculator.test(s)) {
          return true;
        } else {
        return false;
        }
    };

    isDate = (s: string) => {
        const inputCleaned = s.replace(/(?: \?|\?)*/g, "").replace(/\s+$/, "");
        const inputArr = inputCleaned.split(" ");
        const dateString = inputArr[inputArr.length - 1];
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        let match = dateString.match(dateRegex);
        var flag;
        var inputDate = 0;

        if (
        !match ||
        isNaN(Date.parse(match[3] + "-" + match[2] + "-" + match[1]))
        ) {
            flag = false;
        } else {
            const year = parseInt(match[3]);
            const month = parseInt(match[2]);
            const day = parseInt(match[1]);
            const lastDay = new Date(year, month, 0).getDate();

            if (day > lastDay) {
                flag = false;
            } else {
                flag = true;
                inputDate = Date.parse(match[3] + "-" + match[2] + "-" + match[1]);
            }
        }

        return { flag, inputDate };
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