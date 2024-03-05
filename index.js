const searchText = document.getElementById('searchText');
const searchResult = document.getElementById('searchResult');

// Kỹ thuật Debounce
// Giải thích: Là kỹ thuật delay time (vd: 1 giây). Sau 1 giây mà người dùng không nhập bất cứ thứ gì vào ô tìm kiếm nữa thì mới thực thi event handler
const debounce = (callback, delay) => {
    let timer = null;

    // args ở đây chính là đối tượng event (args chính là các tham số được truyền vào bên trong hàm callbak)
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    }
}

// Kỹ thuật Throttle
// Giải thích: Là kỹ thuật wait time (vd: 1 giây). Thực thi event handler ngay lập tức. Cứ 1 giây trôi qua thì nó sẽ thực thi lại cái event handler
const throttle = (callback, delay) => {
    let shouldWait = false;
    // lastArgs: Biến này dùng để lưu trữ lại cái tham số (ở đây là event) mà chúng ta truyền vào trong cái callback hay cụ thể ở đây là cái lần cuối cùng 
    // mà người dùng nhập vào trong ô tìm kiếm là nội dung gì 
    let lastArgs = null;
    
    // args ở đây chính là đối tượng event (args chính là các tham số được truyền vào bên trong hàm callbak)
    return (...args) => {
        if(shouldWait) {
            lastArgs = args;
            return;
        }
    
        callback(...args);
        shouldWait = true;
        setTimeout(() => {
            // Cứ sau 1 giây nó sẽ gỡ block để call api
            if (lastArgs === '' || lastArgs === null || lastArgs === undefined) {
                shouldWait = false;
            }
            else {
                shouldWait = false;
                callback(...lastArgs);
                lastArgs = null;
            }
        }, delay)
    }
}

const handleInputChange= (event) => {
    fetch('https://dummyjson.com/users/search?' + new URLSearchParams({ q: event.target.value }))
    .then((response) => response.json())
    .then((response) => {
        searchResult.innerHTML = "";
        if (response?.users?.length > 0) {
            response.users.forEach((user) => {
                const textElement = document.createElement('p');
                const userName    = document.createTextNode(`${user.firstName} - ${user.lastName}`);
                textElement.appendChild(userName);
                
                searchResult.appendChild(textElement);
            })
        }
    })
    .catch((error) => {
        console.error('ERROR: ', error);
    })
    .finally(() => {
        console.log('Finally');
    })
}

// searchText.addEventListener('input', debounce(handleInputChange, 1000))
searchText.addEventListener('input', throttle(handleInputChange, 1000))

// VD Gõ 1 văn bản liên tục trong 90s liên tiếp (Không dừng quá 1s giữa những lần gõ phím xuống)
// Debounce: Chỉ thực hiện function 1 lần duy nhất kể từ lần cuối cùng người dùng nhâp trên bàn phím
// Throttle: Trigger gọi event handler ngay lập tức => Cứ sau 1s là nó lại gọi lại cái event handler => Gọi tổng cộng 90 lần (1 lần 1s)