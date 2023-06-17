import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import TailFile from "@logdna/tail-file";
import { clientEvent } from "../../lib/game-state";

const socketHandler = (_: NextApiRequest, res: NextApiResponse) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    const fileName = "../Library/Logs/Wizards Of The Coast/MTGA/Player.log";
    new TailFile(fileName, { encoding: "utf8" })
      .on("data", (chunk) => {
        const match = [
          ...chunk.matchAll(/\[UnityCrossThreadLogger\]Draft.Notify ({.*})/g),
        ][0];
        if (match) {
          io.emit(
            "draft-pack",
            JSON.parse(match[1]).PackCards.split(",").map(Number)
          );
        } else {
          const deckMatch = [...chunk.matchAll(/({"Courses":\[.*\]})/g)][0];
          if (deckMatch) {
            const decks = JSON.parse(deckMatch[1]).Courses;
            const draftDeck = decks.find((c: any) =>
              c.InternalEventName.startsWith(
                "ArenaOpen_Day2_DraftTwoB_20221127"
              )
            );
            draftDeck && io.emit("draft-deck", draftDeck);
            const sealedDeck = decks.find((c: any) =>
              c.InternalEventName.startsWith("QualifierWeekend_Day1")
            );
            sealedDeck && io.emit("sealed-deck", sealedDeck);
          } else {
            const gameUpdateMatch = [
              ...chunk.matchAll(
                /{.*"greToClientEvent": { "greToClientMessages": \[ {.*}/g
              ),
            ][0];
            if (gameUpdateMatch) {
              const messages = JSON.parse(gameUpdateMatch[0]).greToClientEvent
                .greToClientMessages;
              messages.forEach(clientEvent);
              io.emit(
                "game-update",
                messages
                  .map((message) => message.gameStateMessage)
                  .filter((m) => m)
                  .filter((m) => m.type === "GameStateType_Diff")
              );
              if (
                messages.find(
                  (message) => message.type === "GREMessageType_SubmitDeckReq"
                )
              ) {
                io.emit("start-sideboard");
              }
            }
          }
        }
      })
      .on("tail_error", (err) => {
        console.error("TailFile had an error!", err);
      })
      .on("error", (err) => {
        console.error("A TailFile stream error was likely encountered", err);
      })
      .start()
      .catch((err) => {
        console.error("Cannot start.  Does the file exist?", err);
      });
  }
  res.end();
};

export default socketHandler;
