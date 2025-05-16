export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
  }
}

const f = async (url: string, method: string, body?: any, headers?: any) => {
  const res = await fetch(`http://api.aeum-gil.com/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ApiError('API Error', res.status);
  }

  return res;
}

const post = (url: string, body: any, isAuthRequired: boolean = true) => {
  return f(url, 'POST', body, {
    Authorization: isAuthRequired ? `Bearer ${localStorage.token}` : '',
  });
}

const get = async (url: string, { isNoCache, isText }: { isNoCache: boolean, isText: boolean } = { isNoCache: false, isText: false }) => {
  let data;

  try {
    if (isNoCache) throw new Error('Force refresh');

    data = JSON.parse(localStorage[url]);
  } catch {
    const res = await f(url, 'GET', undefined, {
      Authorization: `Bearer ${localStorage.token}`,
    });
  
    if (isText) data = await res.text();
    else data = await res.json();
  
    if (isNoCache) {
      delete localStorage[url]
    } else {
      localStorage[url] = JSON.stringify(data);
    }
  }

  return data;
}

const put = (url: string, body: any) => {
  return f(url, 'PUT', body, {
    Authorization: `Bearer ${localStorage.token}`,
  });
}

const del = (url: string) => {
  return f(url, 'DELETE', undefined, {
    Authorization: `Bearer ${localStorage.token}`,
  });
}



export const signUp = async (id: string, password: string) => {
  const res = await post('auth/sign-up', {
    name: id,
    password,
  }, false);

  const token = await res.text();

  return token;
};

export const login = async (id: string, password: string) => {
  const res = await post('auth/sign-in', {
    name: id,
    password,
  }, false);

  const token = await res.text();

  return token;
};

export const getPresignedUrl = async (fileName: string, imageType: string) => await get(
  `files/presigned-url?fileName=${fileName}&imageType=${imageType}`,
  { isNoCache: true, isText: true }
);

export const getChapters = async () => await get('chapters');

export const putChapter = async (id: string, chapter: any) => {
  await put(`chapters/${id}`, {
    title: chapter.title,
    image: 'image',
  });
};

export const postChapter = async (chapter: any) => {
  const res = await post('chapters', {
    title: chapter.title,
    image: 'image',
  });

  const id = await res.text();

  return id;
};

export const deleteChoiceOption = async (id: string) => await del(`choice-options/${id}`);

export const putChoiceOption = async (id: string, choiceOption: any) => await put(`choice-options/${id}`, choiceOption);

export const postChoiceOption = async (choiceOption: any) => await post('choice-options', choiceOption);

export const putPage = async (id: string, page: any) => await put(`pages/${id}`, page);

export const getPages = async (isReload: boolean = false) => await get('pages', { isNoCache: isReload, isText: false });

export const getPage = async (id: string) => await get(`pages/${id}`);

export const getStatus = async () => await get('game/play-status', { isNoCache: true, isText: false });

export const getGameChapters = async () => await get('game/chapters');

export const getGamePages = async () => await get('game/pages');

export const getGameItems = async () => await get('game/items');

export const getGameEndings = async () => await get('game/endings');

export const putGameRecords = async (records: { pageId: number, choiceOptionId: number }) => await put('game/play-records', records);

export const restoreGameReords = async (pageId: number) => await put('game/play-status/restore', { pageId })