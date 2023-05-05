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

    // Iterate each question
    for (let question of questions) {
      const qna = await prisma.qna.findMany();

      // Initialize variables
      var idx = 0;
      var percentageArray = [];
      var resultDate = classify.isDate(question);
      var resultCalcu = classify.isCalculator(question);

      // Check if message empty or not
      if (classify.isEmpty(question)) {
        answer += "Pertanyaan kosong.";
      } else if (resultDate.flag) {
        // Check if message is date or not
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
        // Check if message is calculator or not
        let expression = question;
        try {
          if (expression[expression.length - 1] === "?") {
            // Remove question mark
            expression = expression.slice(0, -1);
          }
          if (resultCalcu.result === undefined) {
            // Persamaan tidak bisa dihitung
            answer += "Sintaks persamaan tidak sesuai.";
          } else {
            if (
              resultCalcu.result.toString() === "Infinity" ||
              resultCalcu.result.toString() === "NaN"
            ) {
              // Infinity diubah menjadi undefined
              answer += "Hasilnya tidak terdefinisi.";
            } else {
              answer +=
                "Hasilnya adalah " + resultCalcu.result.toString() + ".";
            }
          }
        } catch (e) {
          // Syntax not valid
          answer += "Sintaks persamaan tidak sesuai.";
        }
      } else if (classify.isDelete(question)) {
        // Check if message is delete qna
        // Define regex pattern
        let regexQuestion = /^Hapus pertanyaan\s+(.*)$/i;

        // Initialize variables
        let deleteQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        let qnaId = 0;
        let questionArray = [];
        let qIDArray = [];
        let count = 0;

        // Iterate each qna in database
        for (let el of qna) {
          // String matching
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
          // If exact match
          if (found) {
            questionArray.push(el.question.toLocaleLowerCase());
            qIDArray.push(el.qnaId);
            qnaId = el.qnaId;
            count++;
          }
        }
        // If exact match only one
        if (count == 1) {
          let accuracy = stringSimilarity.similarity(
            deleteQuestion[1].toLocaleLowerCase(),
            questionArray[0]
          );
          // Check if percentage similarity bigger than 0.9
          if (accuracy >= 0.9) {
            qnaId = qIDArray[0];

            // Delete QnA
            const deleteQnA = new QnaService();
            await deleteQnA.deleteQna(qnaId);
            answer += "Pertanyaan " + questionArray[0] + " telah dihapus.";
          } else {
            // QnA not found
            answer +=
              "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
          }
        } else if (count > 1) {
          // If exact match bigger than one
          // Initialize variables
          let max = 0;
          let accuracy = 0;
          let i = 0;
          let idx = 0;
          let tempQuestion = "";

          // Calculate similarity percentage for each qna
          for (let q of questionArray) {
            accuracy = 0;
            accuracy = stringSimilarity.similarity(
              deleteQuestion[1].toLocaleLowerCase(),
              q
            );
            // Find maximum similarity percentage
            if (accuracy > max) {
              max = accuracy;
              idx = i;
              tempQuestion = q;
            }
            i++;
          }
          // If found
          if (max >= 0.9) {
            qnaId = qIDArray[idx];
            const deleteQnA = new QnaService();
            await deleteQnA.deleteQna(qnaId);
            answer += "Pertanyaan " + tempQuestion + " telah dihapus.";
          } else {
            // QnA Not Found
            answer +=
              "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
          }
        } else {
          // QnA Not Found
          answer +=
            "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
        }
      } else if (classify.isAdd(question)) {
        // If message is add QnA
        // Define regex pattern
        let regexQuestion = /^Tambahkan pertanyaan (.+) dengan jawaban (.+)$/i;

        // Initialize variables
        let addQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        let qnaId = 0;
        let questionArray = [];
        let qIDArray = [];
        let count = 0;

        // Iterate each question of QnA
        for (let el of qna) {
          // String Matching
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
          // If exact match
          if (found) {
            questionArray.push(el.question.toLocaleLowerCase());
            qIDArray.push(el.qnaId);
            qnaId = el.qnaId;
            count++;
          }
        }
        // If exact match only one
        if (count == 1) {
          let accuracy = stringSimilarity.similarity(
            addQuestion[1].toLocaleLowerCase(),
            questionArray[0]
          );
          // If similarity percentage bigger than threshold
          if (accuracy >= 0.9) {
            qnaId = qIDArray[0];

            // Update jawaban pertanyaan
            const updateQnA = new QnaService();
            await updateQnA.updateQna(
              { question: questionArray[0], answer: addQuestion[2] },
              qnaId
            );
            answer +=
              "Pertanyaan " +
              questionArray[0] +
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
          // If exact match bigger than one
          // Initialize variables
          let max = 0;
          let accuracy = 0;
          let i = 0;
          let idx = 0;
          let tempQuestion = "";

          // Iterate each question of qna
          for (let q of questionArray) {
            accuracy = 0;
            accuracy = stringSimilarity.similarity(
              addQuestion[1].toLocaleLowerCase(),
              q
            );
            // Find maximum similarity percentage
            if (accuracy > max) {
              max = accuracy;
              idx = i;
              tempQuestion = q;
            }
            i++;
          }
          // If maximum bigger than 0.9
          if (max >= 0.9) {
            // Update answer
            qnaId = qIDArray[idx];
            const updateQnA = new QnaService();
            await updateQnA.updateQna(
              { question: tempQuestion, answer: addQuestion[2] },
              qnaId
            );
            answer +=
              "Pertanyaan " +
              tempQuestion +
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

        // Initialize variables
        let found = false;
        let tempAnswer = "";
        let questionArray = [];
        let answerArray = [];
        let count = 0;

        // Iterate each question of qna
        for (let el of qna) {
          // String matching
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
          // If exact match
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
        // If exact match only one
        if (count == 1) {
          let accuracy = stringSimilarity.similarity(
            question.toLocaleLowerCase(),
            questionArray[0]
          );
          // Similarity percentage must be bigger than 0.9
          if (accuracy >= 0.9) {
            answer += answerArray[0];
          } else {
            count = 0;
          }
        }
        // If no exact match or exact match more than 1
        if (count == 0 || count != 1) {
          // Initialize variables
          let percentage: number = 0.0;
          let finalAnswer: string = "";

          // Iterate each question of QnA
          for (let el of qna) {
            // Find maximum percentage
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

          // If there is a similarity bigger than 0.9
          if (percentage >= 0.9) {
            if (finalAnswer[finalAnswer.length - 1] == ".") {
              answer += finalAnswer;
            } else {
              answer += finalAnswer + ".";
            }
          } else if (percentage < 0.9 && percentage > 0.5) {
            // Recommend Questions
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
            // No QnA Found
            answer += "Tidak ada pertanyaan yang cocok dengan database!";
          }
        }
      }
      if (count != questions.length - 1) {
        // Add newline to handle multiple questions from message
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

      // Get all messages
      const allMessages = await this.getAllMessagesInUserHistory(
        userId,
        newHistory.historyId
      );

      // Return new all messages
      return allMessages;
    } else {
      // Create new message
      await prisma.message.create({
        data: {
          messageId: userMessageCount + 1,
          botMessage: answer,
          userMessage: data.userMessage,
          userId: userId,
          historyId: historyId,
        },
      });

      // Get All Messages
      const allMessages = await this.getAllMessagesInUserHistory(
        userId,
        historyId
      );

      // Return all messages
      return allMessages;
    }
  }
}
