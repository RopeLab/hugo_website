export const BACKEND_URL = "http://localhost:3001"

export class ErrorMessage {
  "message": string
}

export const PostAPI = <Content>(
  route: string,
  content: Content,
  OnResult: (response: Response) => void
) => {
  fetch(BACKEND_URL + route, {
    method: 'POST',
    body: JSON.stringify(content),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    }
  }).then(OnResult);
}

export const ResponseToClass = <Result>(
  response: Response,
  OnOk: (result: Result) => void,
  OnErr: () => void,
) => {
  response.json().then((content) => {
    try {
      const result = content as Result;
      OnOk(result);
    } catch (_) {
      OnErr();
    }
  });
}
