
export const BACKEND_URL = "http://localhost:3001"

export class ErrorMessage {
  "message": string
}

export const GetAPI = (
  route: string,
  OnResult: (response: Response) => void
) => {
  fetch(BACKEND_URL + route, {
    method: 'GET',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': BACKEND_URL,
    }
  }).then(OnResult);
}

export const PostAPI = <Content>(
  route: string,
  content: Content,
  OnResult: (response: Response) => void
) => {
  fetch(BACKEND_URL + route, {
    method: 'POST',
    body: JSON.stringify(content),
    credentials: "include",
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': BACKEND_URL,
    }
  }).then(OnResult);
}

export const PostAPIWithoutContent = (
  route: string,
  OnResult: (response: Response) => void
) => {
  fetch(BACKEND_URL + route, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': BACKEND_URL,
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

export const PrintPossibleError = (response: Response, OnOk: (response: Response) => void) => {
  if (!response.ok) {
    ResponseToClass(response, (message: ErrorMessage) => {
      console.log("Error: " + message.message);
    }, () => {
      console.log("No error message!!! This should never happen");
    });
  } else {
    OnOk(response);
  }
}

export const PrintPossibleErrorOrParseData = <Result>(response: Response, OnOk: (result: Result) => void) => {
  if (!response.ok) {
    ResponseToClass(response, (message: ErrorMessage) => {
      console.log("Error: " + message.message);
    }, () => {
      console.log("No error message!!! This should never happen");
    });
  } else {
    ResponseToClass(response, OnOk, () => {
      console.log("Classes did not match!!! This should never happen");
    });
  }
}

export const GetAPIAndParse = <Result>(route: string, OnOk: (result: Result) => void) => {
  GetAPI(route, (response) => {
    PrintPossibleErrorOrParseData(response, OnOk);
  });
}


