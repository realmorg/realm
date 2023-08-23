import { RealmLogicOp } from "../constants/chars";
import { strIncludes } from "./string";

export const isTruthy = (
  operator: string,
  comparator: string,
  value: string
) => {
  const eq = operator === RealmLogicOp.EQUALS_TO ? comparator : null;
  const neq = operator === RealmLogicOp.NOT_EQUALS_TO ? comparator : null;
  const gt = operator === RealmLogicOp.GREATER_THAN ? comparator : null;
  const gte =
    operator === RealmLogicOp.GREATER_THAN_OR_EQUALS_TO ? comparator : null;
  const lt = operator === RealmLogicOp.LESS_THAN ? comparator : null;
  const lte =
    operator === RealmLogicOp.LESS_THAN_OR_EQUALS_TO ? comparator : null;
  const contains = operator === RealmLogicOp.CONTAINS ? comparator : null;

  const isStringOrBoolLike = ["true", "false"].includes(value) || isNaN(+value);
  if (isStringOrBoolLike) {
    return (
      (!!eq && value === eq) ||
      (!!neq && value !== neq) ||
      (!!contains && strIncludes(value, contains))
    );
  }

  return (
    (!!eq && +value === +eq) ||
    (!!neq && +value !== +neq) ||
    (!!gt && +value > +gt) ||
    (!!gte && +value >= +gte) ||
    (!!lt && +value < +lt) ||
    (!!lte && +value <= +lte)
  );
};
