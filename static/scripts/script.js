// ****************************************** UTILS *************************************************
const QS = (selector, qsAll = false) => {
    return qsAll ? document.querySelectorAll(selector) : document.querySelector(selector)
}
const removeActiveClassFromRows = () => {
    const allRows = QS('.row', true);
    allRows.forEach(row => {
        row.classList.remove('activeRow');
    });
}
// ****************************************** UTILS *************************************************


const listenerRows = () => {
    const allRows = QS('.row', true);
    allRows.forEach(row => {
        row.addEventListener('click', () => {
            removeActiveClassFromRows();
            row.classList.add('activeRow')
        })
    });
}

const listenerKeyboard = () => {
    const keyboard = QS('.keyboard button', true);
    keyboard.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeRow = QS('.activeRow');
            if (!activeRow) {
                return
            };
            const activeRowValue = activeRow.querySelector('.value');
            if (btn.dataset.value === 'clear') {
                activeRowValue.innerText = '';
                activeRowValue.dataset.rowvalue = '';
            } else {
                activeRowValue.innerText += btn.dataset.value;
                activeRowValue.dataset.rowvalue += btn.dataset.value;
            }
        })
    })
}

const updateCarts = async (data) => {
    const postReq = await fetch('/updateCarts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    console.log(postReq);
}

const listenerUpdate = async () => {
    const btnUpdate = QS('.update');
    btnUpdate.addEventListener('click', async () => {
        const loginValue = QS('.login input').value;
        if (!loginValue || loginValue.length < 4) {
            alert('Login is required and must be at least 4 characters long');
            return
        }

        const lastUpdate = QS('.lastUpdate');
        const tn = new Date();
        const concatenateDate = `${tn.getFullYear()}-${tn.getMonth() + 1}-${tn.getDate()} ${tn.getHours()}:${tn.getMinutes()}`;
        lastUpdate.innerText = `Last Update: ${concatenateDate}`;
        lastUpdate.dataset.date = concatenateDate;

        const floor = QS('.currentFloor').dataset.floor;

        const msg = {
            floor,
            'Last Update': concatenateDate,
        }

        const allRows = QS('.row', true);
        allRows.forEach(row => {
            const currentRowName = row.dataset.rowname;
            msg[`${currentRowName}`] = row.querySelector('.value').dataset.rowvalue;

        })
        msg.Login = QS('.login input').value;
        await updateCarts(msg);

        location.reload(true);
    })
}
// ****************************************** RUN *************************************************
listenerRows();
listenerKeyboard();
listenerUpdate();
// ****************************************** RUN *************************************************