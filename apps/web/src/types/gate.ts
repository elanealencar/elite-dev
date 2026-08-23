export type GateValidationResult =
  | "VALID"
  | "INVALID"
  | "ALREADY_USED"
  | "WRONG_EVENT";

export type GateValidationResponse = {
  result: GateValidationResult;

  ticket?: {
    id: string;
    code: string;
  };
};