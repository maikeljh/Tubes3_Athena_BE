import { Message, Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma-client";
import { Classification } from "../algorithms/Classification";
import { StringMatching } from "../algorithms/StringMatching";
import { StringSimilarity } from "../algorithms/StringSimilarity";
import { QnaService } from "./qna-service";
import { HistoryService } from "./history-service";

export class MessageService {
  async getAllMessagesInUserHistory(
    userId: number,
    historyId: number
  ): Promise<Message[]> {
    const allMessages = await prisma.message.findMany({
      where: {
        userId: userId,
        historyId: historyId,
      },
    });
    return allMessages;
  }

  async createMessageInUserHistory(
    data: any,
    userId: number,
    historyId: number,
    algorithm: string
  ): Promise<Message[]> {
    /* "We are implementing a 'manual' auto-increment
    of the messageId because if it were auto-incrementing,
    the auto-increment sequence would be preserved within different historyId.
    This would make the messageId unique, allowing it to identify
    a single record in the table. However, having a composite
    primary key (i.e. historyId and messageId) is not good practice,
    even though historyId alone can identify a single record.*/

    /* Currently, the 'manual' auto-increment implementation is not problematic
    because it is not possible to delete an individual record in the message table.However, it would cause issues if deleting an individual record were possible. */
    const userMessageCount = (
      await prisma.message.findMany({
        where: { historyId: historyId },
        select: { messageId: true },
      })
    ).length;

    // Classification Regex Algorithm
    const classify = new Classification();

    // String Matching Algorithm
    const stringMatching = new StringMatching();

    // String Similarity Algorithm
    const stringSimilarity = new StringSimilarity();

    // Main Algorithm
    var count: number = 0;
    let answer: string = "";
    const questions = data.userMessage.split("\n");

    for (let question of questions) {
      const qna = await prisma.qna.findMany();

      var idx = 0;
      var percentageArray = [];
      var resultDate = classify.isDate(question);
      var resultCalcu = classify.isCalculator(question);

      if (classify.isEmpty(question)) {
        answer += "Pertanyaan kosong.";
      } else if (resultDate.flag) {
        var theDate = resultDate.result;
        var days = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];
        var result = days[theDate];
        answer += "Hari " + result + ".";
      } else if (resultCalcu.flag) {
        let expression = question;
        try {
          if (expression[expression.length - 1] === "?") {
            expression = expression.slice(0, -1);
          }
          if (resultCalcu.result === undefined) {
            answer += "Sintaks persamaan tidak sesuai.";
          } else {
            if (resultCalcu.result.toString() === "Infinity") {
              answer += "Hasilnya adalah undefined.";
            } else {
              answer +=
                "Hasilnya adalah " + resultCalcu.result.toString() + ".";
            }
          }
        } catch (e) {
          answer += "Sintaks persamaan tidak sesuai.";
        }
      } else if (classify.isDelete(question)) {
        let regexQuestion = /^Hapus pertanyaan\s+(.*)$/;
        let deleteQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        let qnaId = 0;
        let questionArray = [];
        let qIDArray = [];
        let count = 0;
        for (let el of qna) {
          if (algorithm === "kmp") {
            found = stringMatching.KMPAlgorithm(
              deleteQuestion[1].toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          } else if (algorithm == "bm") {
            found = stringMatching.BMAlgorithm(
              deleteQuestion[1].toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            questionArray.push(el.question.toLocaleLowerCase());
            qIDArray.push(el.qnaId);
            qnaId = el.qnaId;
            count++;
          }
        }
        if (count == 1) {
          let accuracy = stringSimilarity.similarity(
            deleteQuestion[1].toLocaleLowerCase(),
            questionArray[0]
          );
          if (accuracy >= 0.9) {
            qnaId = qIDArray[0];
            // Delete Pertanyaan
            const deleteQnA = new QnaService();
            await deleteQnA.deleteQna(qnaId);
            answer += "Pertanyaan " + deleteQuestion[1] + " telah dihapus.";
          } else {
            answer +=
              "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
          }
        } else if (count > 1) {
          let max = 0;
          let accuracy = 0;
          let i = 0;
          let idx = 0;
          for (let q of questionArray) {
            accuracy = 0;
            accuracy = stringSimilarity.similarity(
              deleteQuestion[1].toLocaleLowerCase(),
              q
            );
            if (accuracy > max) {
              max = accuracy;
              idx = i;
            }
            i++;
          }
          if (max >= 0.9) {
            qnaId = qIDArray[idx];
            const deleteQnA = new QnaService();
            await deleteQnA.deleteQna(qnaId);
            answer += "Pertanyaan " + deleteQuestion[1] + " telah dihapus.";
          } else {
            answer +=
              "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
          }
        } else {
          answer +=
            "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
        }
      } else if (classify.isAdd(question)) {
        let regexQuestion = /^Tambahkan pertanyaan (.+) dengan jawaban (.+)$/;
        let addQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        let qnaId = 0;
        let questionArray = [];
        let qIDArray = [];
        let count = 0;
        for (let el of qna) {
          if (algorithm === "kmp") {
            found = stringMatching.KMPAlgorithm(
              addQuestion[1].toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          } else if (algorithm == "bm") {
            found = stringMatching.BMAlgorithm(
              addQuestion[1].toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            questionArray.push(el.question.toLocaleLowerCase());
            qIDArray.push(el.qnaId);
            qnaId = el.qnaId;
            count++;
          }
        }
        if (count == 1) {
          let accuracy = stringSimilarity.similarity(
            addQuestion[1].toLocaleLowerCase(),
            questionArray[0]
          );
          if (accuracy >= 0.9) {
            qnaId = qIDArray[0];
            // Update jawaban pertanyaan
            const updateQnA = new QnaService();
            await updateQnA.updateQna(
              { question: addQuestion[1], answer: addQuestion[2] },
              qnaId
            );
            answer +=
              "Pertanyaan " +
              addQuestion[1] +
              " sudah ada! Jawaban di-update ke " +
              addQuestion[2] +
              ".";
          } else {
            // Tambahkan pertanyaan ke database
            const addQnA = new QnaService();
            await addQnA.createQna({
              question: addQuestion[1],
              answer: addQuestion[2],
            });
            answer +=
              "Pertanyaan " + addQuestion[1] + " telah ditambah ke database!";
          }
        } else if (count > 1) {
          let max = 0;
          let accuracy = 0;
          let i = 0;
          let idx = 0;
          for (let q of questionArray) {
            accuracy = 0;
            accuracy = stringSimilarity.similarity(
              addQuestion[1].toLocaleLowerCase(),
              q
            );
            if (accuracy > max) {
              max = accuracy;
              idx = i;
            }
            i++;
          }
          if (max >= 0.9) {
            qnaId = qIDArray[idx];
            const updateQnA = new QnaService();
            await updateQnA.updateQna(
              { question: addQuestion[1], answer: addQuestion[2] },
              qnaId
            );
            answer +=
              "Pertanyaan " +
              addQuestion[1] +
              " sudah ada! Jawaban di-update ke " +
              addQuestion[2] +
              ".";
          } else {
            // Tambahkan pertanyaan ke database
            const addQnA = new QnaService();
            await addQnA.createQna({
              question: addQuestion[1],
              answer: addQuestion[2],
            });
            answer +=
              "Pertanyaan " + addQuestion[1] + " telah ditambah ke database!";
          }
        } else {
          // Tambahkan pertanyaan ke database
          const addQnA = new QnaService();
          await addQnA.createQna({
            question: addQuestion[1],
            answer: addQuestion[2],
          });
          answer +=
            "Pertanyaan " + addQuestion[1] + " telah ditambah ke database!";
        }
      } else {
        // Ask Question
        let found = false;
        let tempAnswer = "";
        let questionArray = [];
        let answerArray = [];
        let count = 0;
        for (let el of qna) {
          if (algorithm === "kmp") {
            found = stringMatching.KMPAlgorithm(
              question.toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          } else if (algorithm == "bm") {
            found = stringMatching.BMAlgorithm(
              question.toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            if (el.answer[el.answer.length - 1] == ".") {
              tempAnswer = el.answer;
            } else {
              tempAnswer = el.answer + ".";
            }
            questionArray.push(el.question.toLocaleLowerCase());
            answerArray.push(tempAnswer);
            count++;
          }
        }
        if (count == 1) {
          let accuracy = stringSimilarity.similarity(
            question.toLocaleLowerCase(),
            questionArray[0]
          );
          if (accuracy >= 0.9) {
            answer += answerArray[0];
          } else {
            count = 0;
          }
        }
        if (count == 0 || count != 1) {
          let percentage: number = 0.0;
          let finalAnswer: string = "";

          for (let el of qna) {
            let temp = stringSimilarity.similarity(
              question.toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
            var percentages = temp;
            var percantageQuestion = el.question;
            var percentageArrayData = { percentages, percantageQuestion };
            percentageArray[idx] = percentageArrayData;
            idx++;
            if (temp > percentage) {
              percentage = temp;
              finalAnswer = el.answer;
            }
          }

          if (percentage >= 0.9) {
            if (finalAnswer[finalAnswer.length - 1] == ".") {
              answer += finalAnswer;
            } else {
              answer += finalAnswer + ".";
            }
          } else if (percentage < 0.9 && percentage > 0.5) {
            answer +=
              "Pertanyaan tidak ditemukan di database.\nApakah maksud Anda:\n";
            percentageArray.sort((a, b) => b.percentages - a.percentages);
            if (qna.length < 3) {
              for (let i = 0; i < qna.length; i++) {
                if (i != qna.length - 1) {
                  if (percentageArray[i + 1].percentages > 0.5) {
                    answer +=
                      (i + 1).toString() +
                      ". " +
                      percentageArray[i].percantageQuestion +
                      "\n";
                  } else {
                    answer +=
                      (i + 1).toString() +
                      ". " +
                      percentageArray[i].percantageQuestion;
                    break;
                  }
                } else {
                  answer +=
                    (i + 1).toString() +
                    ". " +
                    percentageArray[i].percantageQuestion;
                }
              }
            } else {
              for (let i = 0; i < 3; i++) {
                if (i != 2) {
                  if (percentageArray[i + 1].percentages > 0.5) {
                    answer +=
                      (i + 1).toString() +
                      ". " +
                      percentageArray[i].percantageQuestion +
                      "\n";
                  } else {
                    answer +=
                      (i + 1).toString() +
                      ". " +
                      percentageArray[i].percantageQuestion;
                    break;
                  }
                } else {
                  answer +=
                    (i + 1).toString() +
                    ". " +
                    percentageArray[i].percantageQuestion;
                }
              }
            }
          } else {
            answer += "Tidak ada pertanyaan yang cocok dengan database!";
          }
        }
      }
      if (count != questions.length - 1) {
        answer += "\n\n";
        count++;
      }
    }

    if (historyId === 0) {
      // Create new history
      const createHistory = new HistoryService();

      const newHistory = await createHistory.createUserHistory(
        userId,
        data.userMessage
      );

      await prisma.message.create({
        data: {
          messageId: userMessageCount + 1,
          botMessage: answer,
          userMessage: data.userMessage,
          userId: userId,
          historyId: newHistory.historyId,
        },
      });

      const allMessages = await this.getAllMessagesInUserHistory(
        userId,
        newHistory.historyId
      );

      return allMessages;
    } else {
      await prisma.message.create({
        data: {
          messageId: userMessageCount + 1,
          botMessage: answer,
          userMessage: data.userMessage,
          userId: userId,
          historyId: historyId,
        },
      });

      const allMessages = await this.getAllMessagesInUserHistory(
        userId,
        historyId
      );

      return allMessages;
    }
  }
}
