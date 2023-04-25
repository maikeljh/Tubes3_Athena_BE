export class StringSimilarity {
    similarity(s1: string, s2: string) {
        let result;

        if (s1.length == 0 || s2.length == 0) {
            result = 1.0;
        } else if (s1.length > s2.length) {
            result = (s1.length - this.editDistance(s1, s2)) / Number(s1.length);
        } else {
            result = (s2.length - this.editDistance(s1, s2)) / Number(s2.length);
        }

        return result;
    }

    editDistance(s1: string, s2: string) {
        let string1 = s1.toLowerCase();
        let string2 = s2.toLowerCase();
        const matrix = [];

        //init first column
        for (let i = 0; i <= string2.length; i++) {
            matrix[i] = [i];
        }

        //init first row
        for (let j = 0; j <= string1.length; j++) {
            matrix[0][j] = j;
        }

        //fill the rest of matrix from 3 matrix above left
        for (let i = 1; i <= string2.length; i++) {
            for (let j = 1; j <= string1.length; j++) {
                if (string2.charAt(i - 1) == string1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] =
                        Math.min(
                        matrix[i - 1][j - 1],
                        Math.min(matrix[i][j - 1], matrix[i - 1][j])
                        ) + 1;
                }
            }
        }

        return matrix[string2.length][string1.length];
    }
}