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

    const qna = (
      await prisma.qna.findMany()
    )

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
    
    for(let question of questions){
      var idx = 0;
      var percentageArray = [];
      var resultDate = classify.isDate(question);
      var resultCalcu = classify.isCalculator(question);
      if (classify.isEmpty(question)){
        answer += "Pertanyaan kosong.";
      } else if (resultDate.flag) {
        var theDate = new Date(resultDate.result);
        var days = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];
        var result = days[theDate.getDay()];
        answer += "Hari " + result + ".";
      } else if (resultCalcu.flag) {
        let expression = question;
        try {
          if (expression[expression.length - 1] === "?") {
            expression = expression.slice(0, -1);
          }
          answer += "Hasilnya adalah " + resultCalcu.result.toString() + ".";
        } catch (e) {
          answer += "Sintaks persamaan tidak sesuai.";
        }
      } else if (classify.isDelete(question)) {
        let regexQuestion = /^Hapus pertanyaan\s+(.*)$/;
        let deleteQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        let qnaId = 0;
        for (let el of qna) {
          if (!found) {
            if(algorithm === "kmp"){
              found = stringMatching.KMPAlgorithm(
                deleteQuestion[1].toLocaleLowerCase(),
                el.question.toLocaleLowerCase()
              );
            } else if(algorithm == "bm"){
              found = stringMatching.BMAlgorithm(
                deleteQuestion[1].toLocaleLowerCase(),
                el.question.toLocaleLowerCase()
              );
            }
          }
          if (found) {
            answer += el.answer + ".";
            qnaId = el.qnaId;
            break;
          }
        }
        if (found) {
          // Delete Pertanyaan
          const deleteQnA = new QnaService();
          deleteQnA.deleteQna(qnaId);
          answer += "Pertanyaan " + deleteQuestion[1] + " telah dihapus.";
        } else {
          answer +=
            "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
        }
      } else if (classify.isAdd(question)) {
        let regexQuestion = /^Tambahkan pertanyaan (.+) dengan jawaban (.+)$/;
        let addQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        let qnaId = 0;
        for (let el of qna) {
          if (!found) {
            found = stringMatching.KMPAlgorithm(
              addQuestion[1].toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            answer += el.answer + ".";
            qnaId = el.qnaId;
            break;
          }
        }
        if (found) {
          // Update jawaban pertanyaan
          const updateQnA = new QnaService();
          updateQnA.updateQna({question: addQuestion[1], answer: addQuestion[2]}, qnaId);
          answer +=
            "Pertanyaan " +
            addQuestion[1] +
            " sudah ada! Jawaban di-update ke " +
            addQuestion[2] + ".";
        } else {
          // Tambahkan pertanyaan ke database
          const addQnA = new QnaService();
          addQnA.createQna({question: addQuestion[1], answer: addQuestion[2]});
          answer +=
            "Pertanyaan " + addQuestion[1] + " telah ditambah ke database!";   
        }
      } else { // Ask Question
        let found = false;
        for (let el of qna) {
          if (!found) {
            found = stringMatching.KMPAlgorithm(
              question.toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            answer += el.answer + ".";
            break;
          }
        }
        if (!found) {
          let percentage: number = 0.0;
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
              if (percentage >= 0.9) {
                answer += el.answer + ".";
              }
            }
          }
          if (percentage < 0.9 && percentage > 0.5) {
            answer +=
              "Pertanyaan tidak ditemukan di database.\nApakah maksud Anda:\n";
            percentageArray.sort((a, b) => b.percentages - a.percentages);
            if (qna.length < 3) {
              for (let i = 0; i < qna.length; i++) {
                if (i != qna.length - 1) {
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
                }
              }
            } else {
              for (let i = 0; i < 3; i++) {
                if (i != 2) {
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
                }
              }
            }
          } else {
            answer += "Tidak ada pertanyaan yang cocok dengan database!";
          }
        }
      }
      if(count != questions.length - 1){
        answer += "\n\n";
        count++;
      }
    }
    
    if (historyId === 0) {
      // Create new history
      const createHistory = new HistoryService();

      const newHistory = await createHistory.createUserHistory(userId, data.userMessage);
      
      await prisma.message.create({
        data: {
          messageId: userMessageCount + 1,
          botMessage: answer,
          userMessage: data.userMessage,
          userId: userId,
          historyId: newHistory.historyId,
        },
      });
      
      const allMessages = await this.getAllMessagesInUserHistory(userId, newHistory.historyId);

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

      const allMessages = await this.getAllMessagesInUserHistory(userId, historyId);

      return allMessages;
    }
  }
}