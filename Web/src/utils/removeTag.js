import _ from "lodash";

export function removeTags(str) {
  return _.trim(
    _.replace(_.replace(str, /<\/?[^>]+(>|$)/g, ""), /&nbsp;/g, "")
  );
}
