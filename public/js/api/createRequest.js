/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const {
        url,
        method = 'GET',
        data,
        callback,
    } = options;

    const safeData = data || {};

    const xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    if (method.toUpperCase() === 'GET') {
        if (data) {
            const dataArr = Object.entries(safeData);
            const dataString = dataArr.map(item => {
                return `${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`
            }).join('&');

            const finalUrl = `${url}?${dataString}`;
            xhr.open(method, finalUrl);
            xhr.send();
        }else  {
            xhr.open(method, url);
            xhr.send();
        }

    }else {
        const formData = new FormData();
            for (const [key, value] of Object.entries(safeData)) {
                formData.append(key, value)
            }

            xhr.open(method, url);
            xhr.send(formData);
    }

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (typeof callback === 'function') {
                callback(null, xhr.response);
            }
        } else {
            if (typeof callback === 'function') {
                callback(new Error(`Ошибка: ${xhr.statusText}`));
            }
        }
    };

    xhr.onerror = () => {
        if (typeof callback === 'function') {
            callback(new Error('Ошибка сети'));
        }
    };
};


