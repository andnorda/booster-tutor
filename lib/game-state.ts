type DieRollResult = {
  systemSeatId: number;
  rollValue: number;
};

type Zone = {
  zoneId: number;
  type:
    | "ZoneType_Revealed"
    | "ZoneType_Suppressed"
    | "ZoneType_Pending"
    | "ZoneType_Command"
    | "ZoneType_Stack"
    | "ZoneType_Battlefield"
    | "ZoneType_Exile"
    | "ZoneType_Limbo"
    | "ZoneType_Hand"
    | "ZoneType_Library"
    | "ZoneType_Graveyard"
    | "ZoneType_Sideboard";
  visibility: "Visibility_Public" | "Visibility_Private" | "Visibility_Hidden";
  ownerSeatId?: number;
  viewers: number;
  objectInstanceIds: number[];
};

type Message = {
  msgId: number;
} & (
  | {
      type: "GREMessageType_ConnectResp";
      connectResp: {
        status: "ConnectionStatus_Success";
        deckMessage: {
          deckCards: number[];
          sideboardCards: number[];
        };
      };
    }
  | {
      type: "GREMessageType_DieRollResultsResp";
      systemSeatIds: number[];
      dieRollResultsResp: {
        playerDieRolls: DieRollResult[];
      };
    }
  | {
      type: "GREMessageType_GameStateMessage";
      gameStateMessage: {
        zones: Zone[];
      } & (
        | {
            type: "GameStateType_Full";
            turnInfo: {
              decisionPlayer: number;
            };
          }
        | {
            type: "GameStateType_Diff";
            turnInfo: {
              activePlayer: number;
              decisionPlayer: number;
            };
          }
      );
    }
);

export const clientEvent = (message: Message) => {};
