import { RealmAttributeNames } from "../constants/attrs";
import { FlowActionTypes } from "../constants/flow";
import { RealmElement } from "../libs/RealmElement.class";
import {
  defineAction,
  doAction,
  findAttr,
  getRawSourceFrom,
} from "../utils/action";
import { ElementDataTypes } from "../utils/element";
import { ActionArg, FlowAction } from "../utils/flow";
import { forEach, fromEntries } from "../utils/object";
import { newError } from "../utils/string";

const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

const ResponseType = {
  JSON: ElementDataTypes.JSON_STRING,
  HTML: ElementDataTypes.HTML,
  TEXT: "text",
} as const;

/**
 * Trigger <http-request /> action
 * @param element
 * @param actionArgs
 * @returns
 */
export const httpRequestAction = defineAction({
  name: FlowActionTypes.HTTP_REQUEST,

  async onTrigger(
    element: RealmElement,
    elementName: string,
    actionArgs: Array<string[]>,
    $event: Event,
    eventType: string,
    eventName: string
  ) {
    const [urlAttr, hasUrlAttr] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.HTTP_URL
    );
    if (!hasUrlAttr)
      throw newError(
        `Missing "${RealmAttributeNames.HTTP_URL}" attribute on <${FlowActionTypes.HTTP_REQUEST} />`
      );

    const [actionAttrs] = findAttr<ActionArg[]>(
      actionArgs,
      RealmAttributeNames.ACTION
    );

    const [responseResponseOkAttr = [], hasResponseOkAttr] = findAttr<
      ActionArg[]
    >(actionAttrs, FlowActionTypes.RESPONSE_SUCCESS);
    const [responseOkActions, hasResponseOkActions] = findAttr<FlowAction[]>(
      responseResponseOkAttr,
      RealmAttributeNames.ACTION
    );

    const [responseResponseFailAttr = [], hasResponseFailAttr] = findAttr<
      ActionArg[]
    >(actionAttrs, FlowActionTypes.RESPONSE_ERROR);
    const [responseFailActions, hasResponseFailActions] = findAttr<
      FlowAction[]
    >(responseResponseFailAttr, RealmAttributeNames.ACTION);

    const isValidHttpRequest = hasResponseOkAttr || hasResponseFailAttr;
    if (!isValidHttpRequest) return;

    const [method = HttpMethod.GET] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.METHOD
    );
    const [asAttr = ResponseType.TEXT] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.AS
    );
    const [headersAttrs = []] = findAttr<ActionArg[][]>(
      actionAttrs,
      FlowActionTypes.REQUEST_HEADER,
      [],
      true
    );

    const headers = new Headers();
    forEach(headersAttrs, (headerAttr) => {
      const header = fromEntries(headerAttr);
      headers.set(
        header[RealmAttributeNames.NAME],
        header[RealmAttributeNames.VALUE]
      );
    });

    const [bodyAttr, hasBodyAttr] = findAttr<ActionArg[]>(
      actionAttrs,
      FlowActionTypes.REQUEST_BODY
    );

    let body;
    if (hasBodyAttr) {
      const [bodyContent, hasBodyContent] = findAttr<ElementDataTypes>(
        bodyAttr,
        RealmAttributeNames.ACTION
      );
      if (hasBodyAttr && hasBodyContent) body = bodyContent;

      const [bodyValueAttr, hasBodyValueAttr] = findAttr<ElementDataTypes>(
        bodyAttr,
        RealmAttributeNames.VALUE
      );
      const [bodyFromAttr, hasBodyFromAttr] = findAttr<ElementDataTypes>(
        bodyAttr,
        RealmAttributeNames.FROM
      );
      if (hasBodyValueAttr && hasBodyFromAttr) {
        body = getRawSourceFrom(element, bodyValueAttr, bodyFromAttr, $event);
      }
    }

    const doActionWrapper = (
      responseAction: FlowAction[],
      $event: Event | Record<string, unknown>
    ) =>
      doAction(element, elementName, responseAction)(
        eventName,
        eventType,
        $event
      );

    try {
      const response = await fetch(urlAttr, {
        body,
        method,
        headers,
      });
      if (!response.ok) throw newError(`[${response.status}] ${urlAttr}`);
      if (!hasResponseOkActions) return;

      const getTextResponse = () => response.text();
      const valueLookup = {
        [ResponseType.JSON]: () => response.json(),
        [ResponseType.HTML]: getTextResponse,
        [ResponseType.TEXT]: getTextResponse,
      };
      const responseValue = await valueLookup?.[asAttr]?.();
      doActionWrapper(responseOkActions, responseValue);
    } catch (err) {
      if (!hasResponseFailActions) return;
      doActionWrapper(responseFailActions, {
        message: "[ERROR] " + err?.message ?? `unknown error, URL: ${urlAttr}`,
      });
    }
  },
});
